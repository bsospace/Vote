import { PrismaClient, PollOption } from "@prisma/client";

const prisma = new PrismaClient();

export type PollOptionModel = PollOption;