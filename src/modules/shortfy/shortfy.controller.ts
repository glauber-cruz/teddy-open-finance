import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ShortfyService } from "./shortfy.service";

import { ShortfyUrlDto } from "./shortfy.dto";
import { Auth } from "../../common/decorators/auth";

import { AuthGuard } from "../../common/guards/auth";
import { AuthRequest } from "../../common/types/http";

import { badRequestError } from "../../common/utils/requestsErrors";
import { isNumericString } from "../../common/utils/isNumericString";

@Controller("/api/shortfy")
export class ShortfyController {

  constructor(private readonly shortfyService: ShortfyService) {}

  @UseGuards(AuthGuard)
  @Auth(false)
  @Post()
  @HttpCode(201)
  async shortfyUrl(@Body() { url }:ShortfyUrlDto, @Req() req:AuthRequest) {
    const user = req.user;
    const shortUrl = await this.shortfyService.createShortUrl(url, user?.id);
    return shortUrl;
  }


  @UseGuards(AuthGuard)
  @Get()
  async getShortfyUrls(@Req() req:AuthRequest) {
    const { id } = req.user;
    const urls = await this.shortfyService.listShortenUrls(id);
    return urls;
  }


  @UseGuards(AuthGuard)
  @Put(":url_id")
  async updateShortUrlOrigin(@Req() req:AuthRequest, @Param("url_id") urlId: string, @Body() { url }:ShortfyUrlDto) {
    if(!isNumericString(urlId)) throw badRequestError("Must be an integer", "url_id");
    const urlIdInt = parseInt(urlId);

    const { id } = req.user;
    await this.shortfyService.update(id, urlIdInt, url); 
  }

  
  @UseGuards(AuthGuard)
  @Delete(":url_id")
  @HttpCode(204)
  async deleteUrl(@Req() req:AuthRequest, @Param("url_id") urlId: string) {
    if(!isNumericString(urlId)) throw badRequestError("Must be an integer", "url_id");
    const urlIdInt = parseInt(urlId);

    const { id } = req.user;
    await this.shortfyService.delete(id, urlIdInt);
  }
}