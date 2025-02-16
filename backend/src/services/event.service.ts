import { PrismaClient, Prisma } from "@prisma/client";
import { DataLog, IEvent } from "../interface";

export class EventService {
    constructor(private prisma: PrismaClient) {
        this.prisma = prisma;
    }

    public async getEvents(
        page: number = 1,
        pageSize: number = 10,
        search?: string,
        logs?: boolean
    ): Promise<{ events: IEvent[]; totalCount: number } | null> {
        try {
            // คำนวณ Offset สำหรับ Pagination
            const skip = (page - 1) * pageSize;
            const take = pageSize;

            // ค้นหา Event ตามเงื่อนไขที่ระบุ และกรองเฉพาะที่ยังไม่ถูกลบ (deletedAt: null)
            const whereCondition: Prisma.EventWhereInput = {
                deletedAt: null, // ✅ ตรวจสอบว่าข้อมูลยังไม่ถูกลบ
                ...(search && {
                    name: { contains: search, mode: Prisma.QueryMode.insensitive },
                }),
            };

            // ดึง Events พร้อมกำหนด Fields ที่ต้องการ
            const events = await this.prisma.event.findMany({
                where: whereCondition,
                skip,
                take,
                orderBy: { createdAt: "desc" },
            });

            // นับจำนวนทั้งหมดของ Events
            const totalCount = await this.prisma.event.count({ where: whereCondition });

            const formattedEvents = events.map((event) => {
                // แปลง `null` เป็น `undefined` เพื่อให้ตรงกับ `Partial<IEvent>`
                return {
                    ...event,
                    description: event.description ?? undefined,
                    dataLogs: logs ? (event.dataLogs as unknown as DataLog[]) : undefined,
                };
            }); // แปลง `null` เป็น `undefined` เพื่อให้ตรงกับ `Partial<IEvent>`

            return { events: formattedEvents, totalCount };
        } catch (error) {
            console.error("[ERROR] getEvents:", error);
            return null;
        }
    }

    public async getEventById(eventId: string): Promise<Partial<IEvent> | null> {
        try {
            // ค้นหา Event ด้วย ID ที่ระบุ
            const event = await this.prisma.event.findFirst({
                where: { id: eventId , deletedAt: null},
                include: {
                    polls: true,
                },
            });

            if (!event) {
                console.error("[ERROR] getEventById: Event not found");
                return null;
            }

            // แปลง `null` เป็น `undefined` เพื่อให้ตรงกับ `Partial<IEvent>`
            const formattedEvent: Partial<IEvent> = {
                ...event,
                description: event.description ?? undefined,
                dataLogs: event.dataLogs ? (event.dataLogs as unknown as DataLog[]) : undefined,
                polls: event.polls.map(poll => ({
                    ...poll,
                    description: poll.description ?? undefined,
                    banner: poll.banner ?? undefined,
                    dataLogs: poll.dataLogs ? (poll.dataLogs as unknown as DataLog[]) : undefined,
                })),
            };

            return formattedEvent;
        } catch (error) {
            console.error("[ERROR] getEventById:", error);
            return null;
        }
    }
}
