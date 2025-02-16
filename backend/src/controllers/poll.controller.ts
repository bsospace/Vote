import { Request, Response, NextFunction } from "express";
import { PollService } from "../services/poll.service";

const pollService = new PollService();

export class PollController {

    async getAllPolls(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const polls = await pollService.getAllPolls();
          res.status(200).json(polls);
        } catch (error) {
          next(error);
        }
    }
    async createPoll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const { title, description, startTime, endTime, createdBy } = req.body;
    
          const newPoll = await pollService.createPoll(
            title,
            description,
            new Date(startTime),
            new Date(endTime),
            createdBy
          );
    
          res.status(201).json(newPoll);
        } catch (error) {
            next(error);
        }
    }
}
