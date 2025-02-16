import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type PollStatModel = PrismaClient['pollStat'];