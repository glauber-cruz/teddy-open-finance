import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";

import { UsersService } from "./users.service";
import { Users } from "../../common/models/users.entity";

import { TypeOrmModule } from "@nestjs/typeorm";
import { Urls } from "../../common/models/urls.entity";

import { UsersUrls } from "../../common/models/UsersUrls.entity";

@Module({
  imports: [ TypeOrmModule.forFeature([ Users, Urls, UsersUrls ]) ],
  controllers: [ UsersController ],
  providers: [ UsersService ]
})

export class UsersModule {}
