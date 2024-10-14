import { Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { UsersUrls } from "./UsersUrls.entity";

@Entity()
@Index("IDX_EMAIL", [ "email" ])
export class Users {

  @PrimaryGeneratedColumn("uuid")
    id: string;

  @Column({ type:"varchar", length:50 })
    name: string;

  @Column({ unique: true, type:"varchar", length:255 })
    email: string;

  @Column({ type:"varchar", length:255 })
    password: string;

  @Column({ type:"varchar", length:255 })
    salt: string;

  @Column({ type:"varchar", nullable:true, length:255 })
    token: string | null;

  @OneToMany(() => UsersUrls, usersUrls => usersUrls.user)
    usersUrls: UsersUrls[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_at: Date;
}