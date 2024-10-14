import { Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { UsersUrls } from "./UsersUrls.entity";

@Entity()
@Index("IDX_SHT_URL", [ "short_id" ])
export class Urls {

  @PrimaryGeneratedColumn("increment")
    id: number;

  @Column({ type:"varchar", length:1000 })
    long_url: string;

  @Column({ type:"varchar", length:255, nullable:true })
    short_id: string;

  @Column({ type:"timestamp", nullable:true })
    deleted_at:Date | null;

  @Column({ type:"int", default:0 })
    views:number;

  @OneToMany(() => UsersUrls, usersUrls => usersUrls.url)
    usersUrls: UsersUrls[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_at: Date;
}