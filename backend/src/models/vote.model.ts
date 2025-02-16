import { PrismaClient, Vote } from "@prisma/client";

const prisma = new PrismaClient();

export type VoteModel = Vote;