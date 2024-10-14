import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Users } from "./users.entity"; 

import { Urls } from "./urls.entity";

@Entity()
export class UsersUrls {

  @PrimaryGeneratedColumn("uuid")
    id: string;

  @ManyToOne(() => Users, user => user.usersUrls, { nullable: true })
    user: Users;

  @ManyToOne(() => Urls, url => url.usersUrls)
    url: Urls;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_at: Date;
}
