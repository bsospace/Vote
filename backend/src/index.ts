import express from "express";
import cors from "cors"
import { PrismaClient } from "@prisma/client";
import router from "./routes";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use("/api", router);

app.get("/", (req, res) => {
    res.send("Welcome to the Express API!");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
