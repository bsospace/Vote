import { Router } from "express";
import pollRoutes from "./poll.routes";

const router = Router();

router.use("/poll", pollRoutes);

export default router;
