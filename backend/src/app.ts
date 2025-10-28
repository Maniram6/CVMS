import express from "express";
import cors from "cors";
import { visitsRouter } from "./routes/visits.routes";
import { clientsRouter } from "./routes/clients.routes";
import { resourcesRouter } from "./routes/resources.routes";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5500", "http://172.28.80.1:5500"],
    // origin: ["http://localhost:5500", "http://172.28.80.1:5500"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/api/visits", visitsRouter);
app.use("/api/clients", clientsRouter);
app.use("/api/resources", resourcesRouter);

export default app;
