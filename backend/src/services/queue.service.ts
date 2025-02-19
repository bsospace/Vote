import { Queue, Worker } from "bullmq";
import Redis from "ioredis";
import { PrismaClient } from "@prisma/client";
import { socketService } from "./socket.service";
import { envConfig } from "../config/config";

class QueueService {
    private voteQueue: Queue;
    private redis: Redis;
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.redis = new Redis({
            host: envConfig.redis.host,
            port: envConfig.redis.port,
            password: envConfig.redis.password,
            maxRetriesPerRequest: null,
        });

        this.voteQueue = new Queue("vote-queue", {
            connection: this.redis,
            defaultJobOptions: {
                removeOnComplete: true,
                removeOnFail: false,
            },
        });

        this.prisma = prisma;
        this.initializeWorker();
    }

    //  เพิ่ม Job เข้า Queue พร้อม Unique Job ID
    public async addVoteToQueue(voteData: { pollId: string; userId: string; optionId: string }) {
        await this.voteQueue.add("new-vote", voteData, {
            jobId: `vote:${voteData.pollId}:${voteData.userId}`,
            attempts: 3,
            backoff: { type: "exponential", delay: 5000 },
            removeOnComplete: true,
        });
    }

    //  Worker สำหรับประมวลผลโหวต
    private initializeWorker() {
        new Worker(
            "vote-queue",
            async (job) => {
                console.log("[INFO] Processing vote:", job.data);
                try {
                    const userVoteKey = `vote:${job.data.pollId}:${job.data.userId}`;
                    const hasVoted = await this.redis.get(userVoteKey);

                    if (hasVoted) {
                        console.warn(`[WARN] User ${job.data.userId} already voted for poll ${job.data.pollId}`);
                        return;
                    }

                    //  ใช้ Transaction เพื่อป้องกัน Data Inconsistency
                    const result = await this.prisma.$transaction(async (tx) => {
                        // เช็คว่า Poll มีอยู่จริง
                        const poll = await tx.poll.findUnique({ where: { id: job.data.pollId } });
                        if (!poll) {
                            throw new Error(`Poll ID ${job.data.pollId} not found or deleted.`);
                        }

                        const vote = await tx.vote.create({
                            data: {
                                pollId: job.data.pollId,
                                userId: job.data.userId,
                                optionId: job.data.optionId,
                            },
                        });

                        await tx.poll.update({
                            where: { id: job.data.pollId },
                            data: { voteCount: { increment: 1 } },
                        });

                        return vote;
                    });

                    console.log("[INFO] Vote saved to database:", result);

                    await this.redis.set(userVoteKey, "true", "EX", 3600);
                    socketService.emitVoteUpdate(job.data.pollId, job.data.optionId);
                    
                } catch (error) {
                    const jobId = job.id ?? `failed-job-${Date.now()}-${Math.random().toString(36).substring(7)}`;
                    await this.prisma.failedJob.create({
                        data: {
                            jobId: jobId,
                            queueName: "vote-queue",
                            data: job.data,
                            error: (error instanceof Error ? error.message : String(error)) || "Unknown error",
                        },
                    });
                    throw error;
                }
            },
            {
                connection: this.redis,
                concurrency: 5,
            }
        ).on("failed", async (job, err) => {
            console.error(`[ERROR] Job ${job?.id} failed:`, err);
            if (job) {
                await this.prisma.failedJob.create({
                    data: {
                        jobId: job.id ?? `unknown-job-${Date.now()}`,
                        queueName: "vote-queue",
                        data: job.data,
                        error: err.message,
                    },
                });
            }
        });

        console.log("[INFO] Vote Queue Worker is running...");
    }
}

export { QueueService };
