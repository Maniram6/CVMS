import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { ClientVisit } from "../entities/ClientVisit";
import { Client } from "../entities/Client";
import { sendMail } from "../services/mail.service";
import { generateClientExcel } from "../services/export.service";

export const getVisits = async (_req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(ClientVisit);
  const visits = await repo.find({
    relations: ["branch", "location", "clients", "onsiteResources"],
  });
  res.json(visits);
};

export const createVisit = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(ClientVisit);
  const visit = repo.create(req.body);
  await repo.save(visit);
  res.status(201).json(visit);
};

export const getVisitById = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(ClientVisit);
  const visit = await repo.findOne({
    where: { client_visit_id: req.params.id },
    relations: ["clients", "onsiteResources", "branch", "location"],
  });
  if (!visit) return res.status(404).json({ message: "Visit not found" });
  res.json(visit);
};

export const sendVisitMail = async (req: Request, res: Response) => {
  try {
    const { visitId } = req.params;

    const repo = AppDataSource.getRepository(ClientVisit);
    const visit = await repo.findOne({
      where: { client_visit_id: visitId },
      relations: ["clients", "onsiteResources", "branch", "location"],
    });

    if (!visit) {
      return res.status(404).json({ message: "Visit not found" });
    }

    // Gather recipients
    const recipients = ["maniram.madu@gmail.com", "anureddy95.polu@gmail.com"];

    const subject = `Client Visit - ${visit.project} Project`;
    const html = `
        <h3>Visit Details</h3>
        <p><strong>Project:</strong> ${visit.project}</p>
        <p><strong>Team:</strong> ${visit.team}</p>
        <p><strong>Dates:</strong> ${visit.visit_from_date} → ${
      visit.visit_to_date
    }</p>
        <p><strong>Branch:</strong> ${visit.branch?.branch_name || "N/A"}</p>
        <p><strong>Location:</strong> ${visit.location?.city_name || "N/A"}</p>
        <hr/>
        <p>This mail was sent automatically from the CVMS system.</p>
      `;

    // Send mail
    await sendMail(recipients, subject, html);
    console.log(`📧 Mail sent for visit: ${visitId}`);

    res.json({ message: "Mail sent successfully" });
  } catch (error) {
    console.error("Mail send error:", error);
    res.status(500).json({ message: "Mail send failed", error });
  }
};

export async function exportVisitExcel(req: Request, res: Response) {
  try {
    const visitId = req.params.visitId; // <-- keep as string (UUID)

    // Fetch all clients linked to this visit
    const clients = await AppDataSource.getRepository(Client).find({
      where: { visit: { client_visit_id: visitId } },
      relations: ["visit"],
    });

    if (!clients || clients.length === 0) {
      return res
        .status(404)
        .json({ message: "No clients found for this visit" });
    }

    // Generate Excel file buffer
    const buffer = await generateClientExcel(clients);

    // Set headers for download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=client_visit_${visitId}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // Send file
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("Error exporting Excel:", err);
    res.status(500).json({ error: "Failed to export Excel" });
  }
}
