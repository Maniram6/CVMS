import express from "express";
import { getVisits, createVisit } from "../controllers/visits.controller";
export const resourcesRouter = express.Router();

resourcesRouter.get("/", getVisits);
resourcesRouter.post("/", createVisit);
