import { ShortfyModule } from "./modules/shortfy/shortfy.module";
import { UsersModule } from "./modules/users/users.module";

import Entities from "./common/constants/entities"; 
import { TypeOrmModule } from "@nestjs/typeorm";

import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";

import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "./modules/auth/auth.module";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:process.env.NODE_ENV === "test" ? ".env.test" : ".env", 
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "5432"),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: Entities,
      synchronize: true,
    }),

    TypeOrmModule.forFeature(Entities),

    JwtModule.register({
      global: true,
    }),
    
    ShortfyModule,
    UsersModule,
    AuthModule
  ],
  controllers: [ AppController ],
  providers: [ AppService ],
})
export class AppModule {}
