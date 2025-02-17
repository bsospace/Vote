import { PrismaClient } from "@prisma/client";

export class PollService {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    public async getPolls(
        page: number = 1,
        pageSize: number = 10,
        search?: string,
        logs?: boolean
    ) {
        try {

            const skip = (page - 1) * pageSize;
            const take = pageSize;

            const whereCondition = {
                deletedAt: null,
                ...(search && {
                    name: { contains: search, mode: "insensitive" },
                }),
            };

            const polls = await this.prisma.poll.findMany({
                where: whereCondition,
                skip,
                take,
                orderBy: { createdAt: "desc" },
            });

            const totalCount = await this.prisma.poll.count({ where: whereCondition });

            const formattedPolls = polls.map((poll) => {
                return {
                    ...poll,
                    description: poll.description ?? undefined,
                    dataLogs: logs ? (poll.dataLogs as unknown) : undefined,
                };
            });

            return { polls: formattedPolls, totalCount };
        } catch (error) {
            console.error("[ERROR] getPolls:", error);
            throw new Error("Failed to fetch polls");
        }
    }

    public async getPoll(pollId: string) {
        try {
            const poll = await this.prisma.poll.findFirst({
                where: { id: pollId, deletedAt: null },
                include: {
                    options: true,
                    votes: true,
                },
            });

            if (!poll) {
                console.warn(`[WARN] Poll with ID ${pollId} not found.`);
                return null;
            }

            return poll;
        } catch (error) {
            console.error("[ERROR] getPoll:", error);
            throw new Error("Failed to fetch poll");
        }
    }
}