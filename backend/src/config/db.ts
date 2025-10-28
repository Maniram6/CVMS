import { DataSource } from "typeorm";
import { Client } from "../entities/Client";
import { ClientVisit } from "../entities/ClientVisit";
import { OnsiteResource } from "../entities/OnsiteResource";
import { Branch } from "../entities/Branch";
import { Location } from "../entities/Location";
import dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false, // in prod use migrations
  logging: false,
  entities: [Client, ClientVisit, OnsiteResource, Branch, Location],
});
