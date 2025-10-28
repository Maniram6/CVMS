import express from "express";
import {
  getVisits,
  createVisit,
  getVisitById,
  sendVisitMail,
  exportVisitExcel,
} from "../controllers/visits.controller";
export const visitsRouter = express.Router();

visitsRouter.get("/", getVisits);
visitsRouter.post("/", createVisit);
visitsRouter.get("/:id", getVisitById);
visitsRouter.post("/:visitId/mail", sendVisitMail);
visitsRouter.get("/:visitId/export", exportVisitExcel);
