import { badRequestError, notFoundError } from "../../common/utils/requestsErrors";
import { Users } from "../../common/models/users.entity";

import { InjectRepository } from "@nestjs/typeorm";
import { genHash } from "../../common/libs/hash";

import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./users.dto";

import { Repository } from "typeorm";
import { UsersUrls } from "../../common/models/UsersUrls.entity";

import { Urls } from "../../common/models/urls.entity";

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,

    @InjectRepository(UsersUrls)
    private readonly usersUrlsRepository: Repository<UsersUrls>,

    @InjectRepository(Urls)
    private readonly urlsRepository: Repository<Urls>
    
  ) {}


  /**
   * Creates a new user with the provided email, name, and password.
   * 
   * @param {CreateUserDto} user - The user details to be created.
   * @returns {Promise<void>} A promise that resolves when the user is created.
   */
  public async createUser({ email, name, password }:CreateUserDto) {
    await this.checkEmailInUse(email);
    const { salt, hash } = await genHash(password);

    await this.usersRepository.save({
      name,
      email,
      password:hash,
      salt
    });
  }


  private async checkEmailInUse(email:string) {
    const emailAlreadyBeingUsed = !!await this.usersRepository.findOne({
      where: { email },
      select:[]
    });

    if(emailAlreadyBeingUsed) throw badRequestError("Email already in use", "email");
  }


  /**
   * Retrieves a user by their ID.
   * 
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<Users>} A promise that resolves to the user object if found, otherwise throws an error.
   * @throws {Error} Throws an error if the user is not found.
   */
  public async getUser(id:string) {
    const user = await this.usersRepository.findOne({
      where:{ id },
      select:[ "email", "id", "name", "created_at", "updated_at" ]
    });

    if(!user) throw notFoundError("User not found");

    return user;
  }


  /**
   * Deletes a user by their ID and marks their associated URLs as deleted.
   * 
   * @param {string} id - The ID of the user to delete.
   * @returns {Promise<void>} A promise that resolves when the user and their URLs are deleted.
   */
  public async delete(id:string) {
    await this.markAsDeletedAllAssociedUrls(id);
    await this.usersUrlsRepository.delete({ user: { id } });
    await this.usersRepository.delete(id);
  }


  private async markAsDeletedAllAssociedUrls(userId:string) {
    const userUrls = await this.usersUrlsRepository.find({ 
      where: { user: { id:userId } }, 
      relations: [ "url" ],
      select:{
        url:{
          id:true
        }
      }
    });

    if (userUrls.length > 0) {
      const urlIds = userUrls.map(userUrl => userUrl.url.id);
      await this.urlsRepository.update(urlIds, { deleted_at: new Date() });
    }
  }

}