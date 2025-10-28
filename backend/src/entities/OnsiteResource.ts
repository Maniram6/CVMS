import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ClientVisit } from "./ClientVisit";

@Entity("onsite_resources")
export class OnsiteResource {
  @PrimaryGeneratedColumn("uuid")
  onsite_resource_id!: string;

  @ManyToOne(() => ClientVisit, (visit) => visit.onsiteResources, { onDelete: "CASCADE" })
  @JoinColumn({ name: "client_visit_id" })
  visit!: ClientVisit;

  @Column()
  resource_name!: string;

  @Column()
  resource_mail!: string;

  @Column({ nullable: true })
  resource_contact!: string;

  @Column({ nullable: true })
  resource_role!: string;

  @Column({ nullable: true })
  created_by!: string;

  @Column({ nullable: true })
  updated_by!: string;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updated_at!: Date;
}
