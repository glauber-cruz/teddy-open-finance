import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "./app.module";

import * as request from "supertest";
import { NestApplication } from "@nestjs/core";

let app: NestApplication;

describe("App Controller", () => {
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

  describe("GET /:short_key", () => {

    it("should redirect to the url", async () => {

      const redirectUrl = "https://www.youtube.com/watch?v=OgCv-qrlRrI&list=RDGMEMP-96bLtob-xyvCobnxVfyw&index=10";

      /*Don't worry about delete the url for this user, all url created to this user is set as deleted automatically after
      all tests to be completed*/
      const response = await request(app.getHttpServer())
        .post("/api/shortfy")
        .send({ url:redirectUrl })
        .set("Authorization", `Bearer ${token}`); 

      const url = response.text;
      const shortUrlKey = url.split(`${process.env.URL}/`)[1];

      await request(app.getHttpServer())
        .get(`/${shortUrlKey}`)
        .expect(302)
        .expect("Location", redirectUrl);
    });


    it("should return 404 if it search for an url that doesn't exists", async () => {
      await request(app.getHttpServer())
        .get("/asd123s")
        .expect(404);
    });
  });
});