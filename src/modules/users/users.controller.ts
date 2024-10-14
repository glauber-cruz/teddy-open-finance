import { Body, Controller, Delete, Get, HttpCode, Post, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";

import { CreateUserDto } from "./users.dto";
import { AuthRequest } from "../../common/types/http";

import { AuthGuard } from "../../common/guards/auth";

@Controller("api/users")
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() user: CreateUserDto ) {
    await this.usersService.createUser(user);
  }

  @UseGuards(AuthGuard)
  @Get("/self")
  async get(@Req() req: AuthRequest) {
    const { id } = req.user;
    return await this.usersService.getUser(id);
  }

  @UseGuards(AuthGuard)
  @Delete("/self") 
  @HttpCode(204)
  async delete(@Req() req: AuthRequest) {
    const { id } = req.user;
    await this.usersService.delete(id);
  }
  
}