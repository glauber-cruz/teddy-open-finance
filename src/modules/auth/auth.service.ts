import { InjectRepository } from "@nestjs/typeorm";
import { compare } from "../../common/libs/hash";

import { Injectable } from "@nestjs/common";
import { Users } from "../../common/models/users.entity";

import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";

import { badRequestError } from "../../common/utils/requestsErrors";

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private jwtService: JwtService
  ) {}


  /**
   * Logs in a user and generates a token.
   * 
   * @param {string} email - The email of the user to login.
   * @param {string} password - The password of the user to login.
   * @returns {Promise<string>} A promise that resolves to the generated token.
   * @throws {Error} Throws an error if the user is not found or if the password does not match.
   */
  public async login(email:string, password:string) { 
    const userFound = await this.getUser(email);
    if(!userFound) throw badRequestError("The provided data does not match our records. Please check and try again.");

    const passwordMatches = await this.validatePassword(password, userFound.password, userFound.salt);
    if(!passwordMatches) throw badRequestError("The provided data does not match our records. Please check and try again.");

    const token = await this.genToken(userFound.id, email);
    await this.usersRepository.update(userFound.id, { token });

    return token;
  }


  private async getUser(email:string) {
    return await this.usersRepository.findOne({
      where: { email },
      select:[ "password", "salt", "id", "email",  ]
    });
  }


  private async validatePassword(password:string, hash:string, salt:string) {
    return await compare(password, hash, salt);
  }


  private async genToken(id:string, email:string) {
    const payload = { id, email };
    const config = { secret:process.env.AUTH_TOKEN_SECRET, expiresIn:"1d" };
    return this.jwtService.signAsync(payload, config);
  }
  

  /**
   * Logs out a user by setting their token to null.
   * 
   * @param {string} id - The ID of the user to logout.
   * @returns {Promise<void>} A promise that resolves when the user is logged out.
   */
  public async logout(id:string) {
    await this.usersRepository.update(id, { token:null });
  }
}
