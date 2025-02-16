import { Router } from "express";
import { PollController } from "../controllers/poll.controller";
import asyncHandler from "express-async-handler";

const router = Router();
const pollController = new PollController();

router.get("/", asyncHandler(pollController.getAllPolls.bind(pollController)));
router.post("/", asyncHandler(pollController.createPoll.bind(pollController)));

export default router;