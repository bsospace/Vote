import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type PollOptionStatModel = PrismaClient['pollOptionStat'];