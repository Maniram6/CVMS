import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { ClientVisit } from "../entities/ClientVisit";
import { Client } from "../entities/Client";

export const getAllClients = async (_req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(Client);
  const visits = await repo.find({
    relations: ["visit"],
  });
  res.json(visits);
};

export const createClient = async (req: Request, res: Response) => {
  try {
    const clientRepo = AppDataSource.getRepository(Client);
    const visitRepo = AppDataSource.getRepository(ClientVisit);

    const { client_visit_id, ...data } = req.body;

    // ✅ Ensure the visit exists
    const visit = await visitRepo.findOne({ where: { client_visit_id } });
    if (!visit) {
      return res.status(404).json({ message: "Visit not found" });
    }

    // ✅ Assign visit relation properly
    const client = clientRepo.create({
      ...data,
      visit, // link full object, not just ID
    });

    await clientRepo.save(client);
    res.status(201).json(client);
  } catch (err) {
    console.error("Error creating client:", err);
    res.status(500).json({ error: "Failed to create client" });
  }
};
