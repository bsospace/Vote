import { PrismaClient } from "@prisma/client";
import { PollModel } from "../models/poll.model";

const prisma = new PrismaClient();

export class PollRepository {
  async createPoll(data: Omit<PollModel, "id" | "createdAt">): Promise<PollModel> {
    return prisma.poll.create({
      data,
    });
  }

  async getPolls(): Promise<PollModel[]> {
    return prisma.poll.findMany();
  }

  async getPollById(id: string): Promise<PollModel | null> {
    return prisma.poll.findUnique({
      where: { id },
    });
  }
}
