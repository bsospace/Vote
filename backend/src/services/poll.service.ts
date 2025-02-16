import { PollModel } from "../models/poll.model";
import { PollRepository } from "../repositories/poll.repository";

const pollRepository = new PollRepository();

export class PollService {

  async getAllPolls(): Promise<PollModel[]> {
    return pollRepository.getPolls();
  }
  async createPoll(
    title: string,
    description: string | null,
    startTime: Date,
    endTime: Date,
    createdBy: string
  ): Promise<PollModel> {
    // Validate business logic (optional)
    if (endTime <= startTime) {
      throw new Error("End time must be after start time.");
    }

    return pollRepository.createPoll({
      title,
      description,
      startTime,
      endTime,
      createdBy,
    });
  }
}
