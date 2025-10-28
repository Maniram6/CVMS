import ExcelJS from "exceljs";
import { Client } from "../entities/Client";

export async function generateClientExcel(clients: Client[]) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Client Visits");

  sheet.columns = [
    { header: "Client Name", key: "client_name" },
    { header: "Email", key: "email" },
    { header: "Contact", key: "contact_no" },
    { header: "Designation", key: "designation" },
  ];

  sheet.addRows(clients.map((c) => ({ ...c })));
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}
