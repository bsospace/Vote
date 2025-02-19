import { PrismaClient } from "@prisma/client";
import { DataLog, IPoll } from "../interface";

export class PollService {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    /**
     * Get all polls with pagination
     * @param page - number
     * @param pageSize - number
     * @param search - string
     * @param logs - boolean
     */

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

    /**
     * Get all polls where user is a participant or guest
     * @param userId - string
     * @param isGuest - boolean
     * @returns - IPoll[]
     */

    public async myPolls(userId: string, isGuest: boolean, logs?: boolean): Promise<{ polls: IPoll[] }> {
        try {

            let polls: IPoll[] = [];

            // Check if user is a guest
            if (isGuest) {

                // Fetch event where user is a guest
                const event = await this.prisma.event.findFirst({
                    where: {
                        guests: {
                            some: {
                                id: userId,
                                deletedAt: null,
                            }
                        }
                    }
                });


                if (!event) {
                    return { polls: [] };
                }

                // Fetch polls where user is a guest
                const rawPolls = await this.prisma.poll.findMany({
                    where: {
                        eventId: event.id,
                        deletedAt: null,
                        isVoteEnd: false,
                    },
                    include: {
                        event: true,
                    }
                });

                // Format polls data
                polls = rawPolls.map(poll => ({
                    ...poll,
                    description: poll.description ?? undefined,
                    banner: poll.banner ?? undefined,
                    dataLogs: logs ? (poll.dataLogs as unknown as DataLog[] | undefined) ?? undefined : undefined,
                    event: poll.event ? {
                        ...poll.event,
                        description: poll.event.description ?? undefined,
                        dataLogs: (poll.event.dataLogs as unknown as DataLog[] | null) ?? undefined,
                    } : undefined,
                }));
            }

            // Check if user is a participant
            if (!isGuest) {

                // Fetch event where user is a participant
                const event = await this.prisma.event.findFirst({
                    where: {
                        whitelist: {
                            some: {
                                userId: userId,
                                deletedAt: null,
                            }
                        }
                    },
                });

                if (!event) {
                    return { polls: [] };
                }

                // Fetch polls where user is a participant
                const rawPolls = await this.prisma.poll.findMany({
                    where: {
                        eventId: event.id,
                        deletedAt: null,
                        isVoteEnd: false,
                    },
                    include: {
                        event: true,
                    }
                });

                // Format polls data
                polls = rawPolls.map(poll => ({
                    ...poll,
                    description: poll.description ?? undefined,
                    banner: poll.banner ?? undefined,
                    dataLogs: logs ? (poll.dataLogs as unknown as DataLog[] | null) ?? undefined : undefined,
                    event: poll.event ? {
                        ...poll.event,
                        description: poll.event.description ?? undefined,
                        dataLogs: (poll.event.dataLogs as unknown as DataLog[] | null) ?? undefined,
                    } : undefined,
                }));
            }
            
            return { polls };
        } catch (error) {
            console.error("[ERROR] myPolls:", error);
            throw new Error("Failed to fetch polls");
        }
    }


    public async myVotedPolls(userId: string, isGuest: boolean, logs?: boolean): Promise<{ polls: IPoll[] }> {
        try {

            let polls: IPoll[] = [];

            if (isGuest) {
                const event = await this.prisma.event.findFirst({
                    where: {
                        guests: {
                            some: {
                                id: userId,
                                deletedAt: null,
                            }
                        }
                    }
                });

                if (!event) {
                    return { polls: [] };
                }

                const rawPolls = await this.prisma.poll.findMany({
                    where: {
                        eventId: event.id,
                        deletedAt: null,
                        isVoteEnd: true,
                    },
                    include: {
                        votes: {
                            where: {
                                userId: userId,
                                deletedAt: null,
                            }
                        }
                    }
                });

                polls = rawPolls.map(poll => ({
                    ...poll,
                    description: poll.description ?? undefined,
                    banner: poll.banner ?? undefined,
                    dataLogs: logs ? (poll.dataLogs as unknown as DataLog[] | null) ?? undefined : undefined,
                    votes: poll.votes.map(vote => ({
                        ...vote,
                        dataLogs: (vote.dataLogs as unknown as DataLog[] | null) ?? undefined,
                    })),
                }));
            }

            if (!isGuest) {
                const event = await this.prisma.event.findFirst({
                    where: {
                        whitelist: {
                            some: {
                                userId: userId,
                                deletedAt: null,
                            }
                        }
                    },
                    include: {
                        polls: {
                            where: {
                                isVoteEnd: true,
                            },
                            include: {
                                votes: {
                                    where: {
                                        userId: userId,
                                        deletedAt: null,
                                    }
                                }
                            }
                        }
                    }
                });

                if (!event) {
                    return { polls: [] };
                }
            }


            const rawPolls = await this.prisma.poll.findMany({
                where: {
                    whitelist: {
                        some: {
                            userId: userId,
                            deletedAt: null,
                        },

                    },
                    deletedAt: null,
                    isVoteEnd: true,
                },

                include: {
                    votes: {
                        where: {
                            userId: userId,
                            deletedAt: null,
                        }
                    },
                    event: true,
                }
            });


            polls = rawPolls.map(poll => ({
                ...poll,
                description: poll.description ?? undefined,
                banner: poll.banner ?? undefined,
                dataLogs: logs ? (poll.dataLogs as unknown as DataLog[] | null) ?? undefined : undefined,
                event: poll.event ? {
                    ...poll.event,
                    description: poll.event.description ?? undefined,
                    dataLogs: (poll.event.dataLogs as unknown as DataLog[] | null) ?? undefined,

                } : undefined,
                votes: poll.votes.map(vote => ({
                    ...vote,
                    dataLogs: (vote.dataLogs as unknown as DataLog[] | null) ?? undefined,
                })),
            }));

            return { polls: polls };

        } catch (error) {
            console.error("[ERROR] myPolls:", error);
            throw new Error("Failed to fetch polls");
        }
    }

    /**
     * Get all public polls
     * @param page - number
     * @param pageSize - number
     * @param search - string
     * @param logs - boolean
     * @returns - IPoll[]
     */

    public async publicPolls(
        page: number = 1,
        pageSize?: number,
        search?: string,
        logs?: boolean) {
        try {
            const skip = pageSize ? (page - 1) * pageSize : undefined;
            const take = pageSize || undefined;

            const whereCondition = {
                deletedAt: null,
                isPublic: true,
                isVoteEnd: false,
                ...(search && {
                    name: { contains: search, mode: "insensitive" },
                }),

            };

            const polls = await this.prisma.poll.findMany({
                where: whereCondition,
                skip,
                take,
                orderBy: { createdAt: "desc" },
                include: {
                    event: true,
                }
            });


            const formattedPolls = polls.map((poll) => ({
                ...poll,
                description: poll.description || undefined,
                dataLogs: logs ? poll.dataLogs : undefined,
                event: poll.event
                    ? {
                        ...poll.event,
                        description: poll.event.description || undefined,
                        dataLogs: logs ? poll.event.dataLogs : undefined,
                    }
                    : null,
            }));

            return formattedPolls;
        } catch (error) {
            console.error("[ERROR] publicPolls:", error);
            throw new Error("Failed to fetch public polls");
        }
    }

    /**
     * Get a poll by ID
     * @param pollId - string
     * @returns - IPoll
     * @throws - Error
     */
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

            // count total votes

            poll.options = poll.options.map((option) => {
                const votes = poll.votes.filter((vote) => vote.optionId === option.id);
                return {
                    ...option,
                    votes: votes.length,
                };
            });

            return poll;
        } catch (error) {
            console.error("[ERROR] getPoll:", error);
            throw new Error("Failed to fetch poll");
        }
    }

    /**
     * Check if user can vote
     * @param pollId - string
     * @param userId - string
     * @param isGuest - boolean
     * @returns - boolean
     */

    public async userCanVote(pollId: string, userId: string, isGuest: boolean): Promise<boolean> {
        try {

            // Check if user is a guest
            if (isGuest) {
                const event = await this.prisma.event.findFirst({
                    where: {
                        polls: {
                            some: {
                                id: pollId,
                                isVoteEnd: false,
                            }
                        },
                        guests: {
                            some: {
                                id: userId,
                                deletedAt: null,
                            }
                        }
                    }
                });

                return !!event;
            }

            // Check if user is a participant
            const canVote = await this.prisma.poll.findFirst({
                where: {
                    id: pollId,
                    isVoteEnd: false,
                    whitelist: {
                        some: {
                            userId: userId,
                            deletedAt: null,
                        }
                    },
                    deletedAt: null,
                }
            });

            return !!canVote;

        } catch (error) {
            console.error("[ERROR] userCanVote:", error);
            throw new Error("Failed to check user vote");
        }
    }
}