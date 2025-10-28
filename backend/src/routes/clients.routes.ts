import express from "express";
import { getAllClients, createClient } from "../controllers/clients.controller";
export const clientsRouter = express.Router();

clientsRouter.get("/", getAllClients);
clientsRouter.post("/", createClient);
