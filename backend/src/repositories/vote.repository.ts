import { PrismaClient } from "@prisma/client";
import { VoteModel } from "../models/vote.model";

const prisma = new PrismaClient();

export const voteRepository = {
  async createVote(vote: VoteModel) {
    return await prisma.vote.create({
      data: vote,
    });
  },

  async getVoteById(id: string) {
    return await prisma.vote.findUnique({
      where: {
        id,
      },
    });
  },
}