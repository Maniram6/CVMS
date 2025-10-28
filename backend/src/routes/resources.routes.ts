import express from "express";
import {
  getAllResources,
  createResource,
} from "../controllers/resources.controller";
export const resourcesRouter = express.Router();

resourcesRouter.get("/", getAllResources);
resourcesRouter.post("/", createResource);
