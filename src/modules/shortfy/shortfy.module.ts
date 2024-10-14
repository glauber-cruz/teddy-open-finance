import { Module } from "@nestjs/common";
import { ShortfyController } from "./shortfy.controller";

import { ShortfyService } from "./shortfy.service";
import { Urls } from "../../common/models/urls.entity";

import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "../../common/models/users.entity";

import { UsersUrls } from "../../common/models/UsersUrls.entity";

@Module({
  imports: [ TypeOrmModule.forFeature([ Urls, Users, UsersUrls ]) ],
  controllers: [ ShortfyController ],
  providers: [ ShortfyService ]
})
export class ShortfyModule {}