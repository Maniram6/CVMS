import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Branch } from "./Branch";
import { ClientVisit } from "./ClientVisit";

@Entity("location")
export class Location {
  @PrimaryColumn()
  city_name!: string;

  @Column({ nullable: true })
  state_name!: string;

  @Column({ nullable: true })
  country_name!: string;

  // One city can have many branches
  @OneToMany(() => Branch, (branch) => branch.location)
  branches!: Branch[];

  // One city can have many visits
  @OneToMany(() => ClientVisit, (visit) => visit.location)
  visits!: ClientVisit[];
}
