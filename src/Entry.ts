import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";
import { CheckType } from "./Interfaces";

@Entity()
export class Entry extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  slug: string;

  @Column()
  type: CheckType;

  @Column({ nullable: true })
  messageId?: string;
}
