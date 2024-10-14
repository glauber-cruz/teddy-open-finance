import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../app.module"; 

import * as request from "supertest";
import { NestApplication } from "@nestjs/core";

let app: NestApplication;
let token: string;

const testUser = {
  name: "teddy",
  email: "ice-teddy-test@example.com",
  password: "Password123?",
};

export default async () => {

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [ AppModule ],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
  
  await createTestUser();

  // Authenticate the user to get the token
  const response = await request(app.getHttpServer())
    .post("/api/auth") 
    .send({
      email: testUser.email,
      password: testUser.password,
    })
    .expect(201);

  token = response.text;
  process.env.TEST_AUTH_TOKEN = token;

  process.env.TEST_USER_EMAIL = testUser.email;
  process.env.TEST_USER_PASSWORD = testUser.password;
};


async function createTestUser() {
  try {
    await request(app.getHttpServer())
      .post("/api/users")
      .send(testUser)
      .expect(201);
  }
  catch {
    return "";
  }
}

export const closeApp = async () => {
  await app.close();
};