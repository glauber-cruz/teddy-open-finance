import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../app.module";

import * as request from "supertest";
import { NestApplication } from "@nestjs/core";

let app: NestApplication;

describe("Auth Guard", () => {
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ AppModule ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    token = process.env.TEST_AUTH_TOKEN || "";
  });

  afterAll(async () => {
    await app.close();
  });

  describe("Test token authentication errors", () => {

    it("should return 401 if token wasn't sent to a route that requires it", async () => {
      await request(app.getHttpServer())
        .get("/api/users/self")
        .expect(401);
    });

    it("should return 401 if token is invalid or if token is sent without Bearer", async () => {
      await request(app.getHttpServer())
        .get("/api/users/self")
        .set("Authorization", "asdas")
        .expect(401);

      await request(app.getHttpServer())
        .get("/api/users/self")
        .set("Authorization", `${token}`)
        .expect(401);
    });

  });
});