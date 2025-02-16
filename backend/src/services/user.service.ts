import { HttpError } from '../utils/handler.util';
import { Guest, PrismaClient, User } from '@prisma/client';

export class UserService {

    private prisma;
    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }
    /**
       * getUserById retrieve a user by ID
       * @param id the user ID
       * @returns the user with the specified ID
       */

    public async getUserById(id: string): Promise<User | null> {
        try {

            const user = await this.prisma.user.findUnique({
                where: {
                    id: id,
                },
            });

            return user;
        } catch (error) {
            console.error('Error retrieving user by ID:', error);
            throw new HttpError(500, 'Failed to retrieve user by ID', error);
        }
    }

    /**
     * getUserByEmail retrieve a user by email
     * @param email the user email
     * @returns the user with the specified email
     */

    public async getUserByEmail(email: string): Promise<User | null> {
        try {

            const user = await this.prisma.user.findUnique({
                where: {
                    email: email,
                },
            });

            return user;
        } catch (error) {
            console.error('Error retrieving user by email:', error);
            throw new HttpError(500, 'Failed to retrieve user by email', error);
        }
    }

    /**
     * Get a guest user by ID
     * @param id - The guest user ID.
     * @returns 
     */

    public async getGuestUserById(
        id: string
    ): Promise<Guest | null> {
        try {
            const guest = await this.prisma.guest.findFirst(
                {
                    where: {
                        id: id,
                    },
                }
            );
            return guest;
        } catch (error) {
            console.error('Error retrieving guest user:', error);
            throw new HttpError(500, 'Failed to retrieve guest user', error);
        }
    }

    public async getGuestByKey(key: string): Promise<Guest | null> {
        try {
            const guest = await this.prisma.guest.findFirst(
                {
                    where: {
                        key: key,
                    },
                }
            );

            console.log('guest', guest);
            return guest;
        } catch (error) {
            console.error('Error retrieving guest user:', error);
            throw new HttpError(500, 'Failed to retrieve guest user', error);
        }
    }

    public async createUser(User: Partial<User>): Promise<User> {
        try {
            const user = await this.prisma.user.create({
                data: {
                    ...User,
                    email: User.email || '',
                    avatar: User.avatar || '',
                    firstName: User.firstName || '',
                    lastName: User.lastName || '',
                    dataLogs: User.dataLogs ?? undefined,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });
            return user;
        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error("Failed to create user.");
        }
    }
}