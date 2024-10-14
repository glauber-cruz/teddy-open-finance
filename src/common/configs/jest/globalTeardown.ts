import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../app.module"; 

import * as request from "supertest";
import { NestApplication } from "@nestjs/core";

let app: NestApplication;

export default async () => {

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [ AppModule ],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();

  const token = process.env.TEST_AUTH_TOKEN;

  await request(app.getHttpServer())
    .delete("/api/users/self")
    .set("Authorization", `Bearer ${token}`)
    .expect(204);
};

export const closeApp = async () => {
  await app.close();
};