import express from "express";
import { getVisits, createVisit } from "../controllers/visits.controller";

export const clientsRouter = express.Router();

clientsRouter.get("/", getVisits);
clientsRouter.post("/", createVisit);