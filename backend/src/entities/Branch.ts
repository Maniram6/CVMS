import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Location } from "./Location";
import { ClientVisit } from "./ClientVisit";

@Entity("branch")
export class Branch {
  @PrimaryColumn()
  branch_name!: string;

  @ManyToOne(() => Location, (location) => location.branches, { onDelete: "CASCADE" })
  @JoinColumn({ name: "location" })
  location!: Location;

  @Column({ nullable: true })
  address!: string;

  @OneToMany(() => ClientVisit, (visit) => visit.branch)
  visits!: ClientVisit[];
}
