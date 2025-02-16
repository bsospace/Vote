import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { PollService } from "../services/poll.service";
import { PollController } from "../controllers/poll.controller";
import { getAllPollValidator, getPollByIdValidator } from "../utils/validators/poll.util";
import { validateRequest } from "../middlewares/validate.middleware";

const router = Router();


const prisma = new PrismaClient();
const pollService = new PollService(prisma)

const pollController = new PollController(pollService);


router.get('/', getAllPollValidator(), validateRequest, pollController.getPolls);
router.get('/:pollId', getPollByIdValidator(), pollController.getPoll);

export {
    router as pollRouters
}