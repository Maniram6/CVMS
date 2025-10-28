import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Client } from "./Client";
import { OnsiteResource } from "./OnsiteResource";
import { Branch } from "./Branch";
import { Location } from "./Location";

@Entity("client_visits")
export class ClientVisit {
  @PrimaryGeneratedColumn("uuid")
  client_visit_id!: string;

  @Column()
  project!: string;

  @Column({ nullable: true })
  team!: string;

  @Column({ type: "date" })
  visit_from_date!: string;

  @Column({ type: "date" })
  visit_to_date!: string;

  @ManyToOne(() => Branch, (branch) => branch.visits)
  @JoinColumn({ name: "branch_name" })
  branch!: Branch;

  @ManyToOne(() => Location, (location) => location.visits)
  @JoinColumn({ name: "location" })
  location!: Location;
  

  @Column({ default: "ACTIVE" })
  status!: string;

  @Column({ nullable: true })
  created_by!: string;

  @Column({ nullable: true })
  updated_by!: string;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updated_at!: Date;

  @OneToMany(() => Client, (client) => client.visit)
  clients!: Client[];

  @OneToMany(() => OnsiteResource, (resource) => resource.visit)
  onsiteResources!: OnsiteResource[];
}
