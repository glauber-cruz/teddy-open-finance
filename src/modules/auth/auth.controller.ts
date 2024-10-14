import { Body, Controller, Delete, HttpCode, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";

import { LoginDto } from "./auth.dto";
import { AuthGuard } from "../../common/guards/auth";

import { AuthRequest } from "../../common/types/http";

@Controller("api/auth")
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(201)
  async login(@Body() { email, password }:LoginDto) {
    const token = await this.authService.login(email, password);
    return token;
  }

  @UseGuards(AuthGuard)
  @Delete("/logout")
  @HttpCode(204)
  async logout(@Req() req: AuthRequest) {
    const { id } = req.user;
    await this.authService.logout(id);
  }

}
