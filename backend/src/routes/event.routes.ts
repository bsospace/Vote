import { Router } from 'express';

import { EventController } from '../controllers/event.controller';
import { EventService } from '../services/event.service';
import { PrismaClient } from '@prisma/client';
import { getAllEventValidator, getEventByIdValidator } from '../utils/validators/event.util';
import { validateRequest } from '../middlewares/validate.middleware';

const router = Router();

const prisma = new PrismaClient();
const eventService = new EventService(
    prisma
);

const eventController = new EventController(eventService);


router.get('/', getAllEventValidator(), validateRequest, eventController.getEvents);

router.get('/:eventId', getEventByIdValidator(), validateRequest, eventController.getEvent);

export {
    router as eventRouters
}