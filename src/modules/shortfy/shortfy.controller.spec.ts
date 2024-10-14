import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../app.module";

import * as request from "supertest";
import { NestApplication } from "@nestjs/core";

import { isUrl } from "../../common/utils/isUrl";

let app: NestApplication;

describe("Shortfy Controller", () => {
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

  describe("POST /api/shortfy", () => {

    const endpoint = "/api/shortfy";

    it("should create a new url as a guest", async () => {
      
      const response = await request(app.getHttpServer())
        .post(endpoint)
        .send({ url:"https://www.chess.com/" }); // I love chess :D

      expect(response.status).toBe(201);
      expect(isUrl(response.text)).toBeTruthy();
    });


    it("should create a new url as an user", async () => {
      
      const response = await request(app.getHttpServer())
        .post(endpoint)
        .send({ url:"https://github.com/glauber-cruz" }) // Best git ever :p
        .set("Authorization", `Bearer ${token}`); 

      expect(response.status).toBe(201);
      expect(isUrl(response.text)).toBeTruthy();
    });

  });

  describe("GET /api/shortfy", () => {
    
    const endpoint = "/api/shortfy";

    it("should list the urls created by the user", async () => {
      const testUrl = "https://github.com/glauber-cruz"; // Best git ever :p

      const response = await request(app.getHttpServer())
        .get(endpoint)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      const data = findByUrl(testUrl, response.body);

      expect(data?.longUrl).toBe(testUrl);
      expect(data?.createAt).toBeDefined();

      expect(data?.updateAt).toBeDefined();
      expect(isUrl(data?.shortUrl || "")).toBeTruthy();

      expect(data?.id).toBeDefined();
    });

  });


  describe("PUT /api/shortfy/:url_id", () => {
    
    const oldUrl = "https://github.com/glauber-cruz";
    const newUrl = "https://www.youtube.com/watch?v=AUARjexCTlQ";

    it("should update the origin url by id", async () => {

      const getEndpoint = "/api/shortfy";
    
      const res = await request(app.getHttpServer())
        .get(getEndpoint)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      const oldData = findByUrl(oldUrl, res.body);

      const endpoint = `/api/shortfy/${oldData?.id}`;

      await request(app.getHttpServer())
        .put(endpoint)
        .send({ url:newUrl }) 
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
      

      const response = await request(app.getHttpServer())
        .get(getEndpoint)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      const data = findByUrl(newUrl, response.body);
      expect(data?.longUrl).toBe(newUrl);

      expect(data?.id).toBe(oldData?.id);
    });


    it("should return 403 if url wasn't found in the user account", async () => {
      await request(app.getHttpServer())
        .put("/api/shortfy/0")
        .send({ url:newUrl }) 
        .set("Authorization", `Bearer ${token}`)
        .expect(403);
    });


    it("should return 400 if a letter is add to the id", async () => {
      await request(app.getHttpServer())
        .put("/api/shortfy/as2")
        .send({ url:newUrl }) 
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
    });

  });


  describe("DELETE /api/shortfy/:url_id", () => {

    it("should delete the url and the user must not be able to list it", async () => {
      const url = "https://www.youtube.com/watch?v=AUARjexCTlQ";
      const getEndpoint = "/api/shortfy";
    
      const res = await request(app.getHttpServer())
        .get(getEndpoint)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      const oldData = findByUrl(url, res.body);
      const endpoint = `/api/shortfy/${oldData?.id}`;

      await request(app.getHttpServer())
        .delete(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);
      
      const response = await request(app.getHttpServer())
        .get(getEndpoint)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
      
      const newData = findByUrl(url, response.body);
      expect(newData).toBeUndefined();
    });


    it("should return 403 if the user try to delete a url that he doesn't own", async () => {
      await request(app.getHttpServer())
        .delete("/api/shortfy/0")
        .set("Authorization", `Bearer ${token}`)
        .expect(403);
    });


    it("should return 400 if a letter is add to the id", async () => {
      await request(app.getHttpServer())
        .delete("/api/shortfy/asx2")
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
    });

  });

});

type Urls = {
  longUrl:string;
  createAt:string;
  updateAt:string;
  shortUrl:string;
  id:number;
}

function findByUrl(testUrl:string, urls:Urls[]) {
  for(const url of urls) {
    if(url.longUrl === testUrl) return url;
  }
}