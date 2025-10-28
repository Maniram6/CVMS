import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { OnsiteResource } from "../entities/OnsiteResource";
import { ClientVisit } from "../entities/ClientVisit";

export const getAllResources = async (_req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(OnsiteResource);
  const visits = await repo.find({
    relations: ["visit"],
  });
  res.json(visits);
};

export const createResource = async (req: Request, res: Response) => {
  try {
    const onsiteResourceRepo = AppDataSource.getRepository(OnsiteResource);
    const visitRepo = AppDataSource.getRepository(ClientVisit);

    const { client_visit_id, ...data } = req.body;

    // ✅ Ensure the visit exists
    const visit = await visitRepo.findOne({ where: { client_visit_id } });
    if (!visit) {
      return res.status(404).json({ message: "Visit not found" });
    }

    // ✅ Assign visit relation properly
    const client = onsiteResourceRepo.create({
      ...data,
      visit, // link full object, not just ID
    });

    await onsiteResourceRepo.save(client);
    res.status(201).json(client);
  } catch (err) {
    console.error("Error creating resource:", err);
    res.status(500).json({ error: "Failed to create resource" });
  }
};
