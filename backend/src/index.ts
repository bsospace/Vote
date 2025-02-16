import app from "./app";
import { authRouters } from "./routes/auth.routes";
import { eventRouters } from "./routes/event.routes";
import { pollRouters } from "./routes/poll.routes";


// Routes for events
app.use("/api/v1/events", eventRouters);
app.use("/api/v1/polls", pollRouters);
app.use("/api/v1/auth", authRouters);