import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { unauthorizedError } from "../../utils/requestsErrors";

import { Users } from "../../models/users.entity";
import { InjectRepository } from "@nestjs/typeorm";

import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";

import { Repository } from "typeorm";
import { Request } from "express";


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private jwtService: JwtService,
    private reflector: Reflector
  ) {}
  
  async canActivate(context: ExecutionContext) {
    let authIsRequired = this.reflector.get<boolean>("auth", context.getHandler());
    try {
      if(authIsRequired === undefined) authIsRequired = true;

      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);

      if(!token && !authIsRequired) return true;
      if (!token) throw unauthorizedError("Invalid token", "authorization");

      const payload = await this.jwtService.verifyAsync(token, { secret: process.env.AUTH_TOKEN_SECRET });
      const isTokenValidInDatabase = await this.validateTokenInDatabase(payload.id, token);

      if(!isTokenValidInDatabase && !authIsRequired) return true;
      if(!isTokenValidInDatabase) throw unauthorizedError("Invalid token", "authorization");

      request["user"] = payload;
      return true;
    } 
    catch {
      if(!authIsRequired) return true;
      throw unauthorizedError("Invalid token", "authorization");
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [ type, token ] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }

  private async validateTokenInDatabase(id:string, sentToken:string) {
    const user = await this.usersRepository.findOne({
      where:{ id },
      select:[ "token" ]
    });

    if(!user) return false;
    return user.token === sentToken;
  }
}