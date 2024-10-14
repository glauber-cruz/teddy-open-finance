import { Controller, Get, Param, Res } from "@nestjs/common";
import { AppService } from "./app.service";

import { Response } from "express";


@Controller()
export class AppController {

  constructor(private readonly appService: AppService) {}

  @Get(":short_key")
  async getUrl(@Param("short_key") shortKey: string, @Res() res: Response) {
    const longUrl = await this.appService.getLongUrl(shortKey);
    return res.redirect(longUrl);
  }
}