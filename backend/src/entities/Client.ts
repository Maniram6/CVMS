import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ClientVisit } from "./ClientVisit";

@Entity("clients")
export class Client {
  @PrimaryGeneratedColumn("uuid")
  client_id!: string;

  @ManyToOne(() => ClientVisit, (visit) => visit.clients, { onDelete: "CASCADE" })
  @JoinColumn({ name: "client_visit_id" })
  visit!: ClientVisit;

  @Column()
  client_name!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  contact_no!: string;

  @Column({ nullable: true })
  designation!: string;

  @Column({ nullable: true })
  created_by!: string;

  @Column({ nullable: true })
  updated_by!: string;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updated_at!: Date;
}
