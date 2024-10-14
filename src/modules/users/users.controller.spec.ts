import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../app.module";

import * as request from "supertest";
import { NestApplication } from "@nestjs/core";

let app: NestApplication;

describe("User Controller", () => {
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

  describe("POST /users", () => {

    const endpoint = "/api/users";

    it("should return 400 if email is already in use", async () => {
      const existingUser = {
        name: "Existing User",
        email: process.env.TEST_USER_EMAIL,
        password: process.env.TEST_USER_PASSWORD
      };

      const response = await request(app.getHttpServer())
        .post(endpoint)
        .send(existingUser);

      expect(response.status).toBe(400);
      expect(response.body.message[0].message).toContain("Email already in use");
    });
  });


  describe("GET /self", () => {
    const endpoint = "/api/users/self";
  
    it("should return the current user's information", async () => {
  
      const response = await request(app.getHttpServer())
        .get(endpoint)
        .set("Authorization", `Bearer ${token}`); 
  
      expect(response.status).toBe(200);

      expect(response.body.id).toBeDefined();
      expect(response.body.email).toBe(process.env.TEST_USER_EMAIL);

      expect(response.body.name).toBeDefined();
      expect(response.body.created_at).toBeDefined();

      expect(response.body.updated_at).toBeDefined();
    });
  });
});