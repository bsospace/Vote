import { PrismaClient, Poll } from "@prisma/client";

const prisma = new PrismaClient();

export type PollModel = Poll; // Use Prisma's generated Poll type
