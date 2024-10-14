import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../app.module";

import * as request from "supertest";
import { NestApplication } from "@nestjs/core";

let app: NestApplication;

describe("Auth Controller", () => {

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ AppModule ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("POST /api/auth", () => {

    const endpoint = "/api/auth";

    it("should return bad request if user type an email that doesn't exists", async () => {
      await request(app.getHttpServer())
        .post(endpoint)
        .send({ email:"not-exist-emailkkkkk@xburguer.com", password:"Password1?123" }) // Do not ask me how did i come up with xburguer lol
        .expect(400);
    });


    it("should return bad request if user type the password wrong", async () => {
      await request(app.getHttpServer())
        .post(endpoint)
        .send({ email:process.env.TEST_USER_EMAIL, password:"Password1?123" })
        .expect(400);
    });

  });

});