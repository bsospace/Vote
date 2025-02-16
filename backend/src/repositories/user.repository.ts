import { PrismaClient } from "@prisma/client";
import { UserModel } from "../models/user.model";

const prisma = new PrismaClient();

export const UserRepository = {
    async getAllUsers() {
        return await prisma.user.findMany();
    },

    async getUserById(id: string) {
        return await prisma.user.findUnique({
            where: {
                id: id
            }
        });
    },

    async createUser(user: UserModel) {
        return await prisma.user.create({
            data: user 
        });
    },
};