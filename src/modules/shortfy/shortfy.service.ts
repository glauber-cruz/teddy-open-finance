import { generateUrlKey } from "../../common/utils/generateUrlKey";
import { Injectable } from "@nestjs/common";

import { Urls } from "../../common/models/urls.entity";
import { InjectRepository } from "@nestjs/typeorm";

import { IsNull, Repository } from "typeorm";
import { Users } from "../../common/models/users.entity";

import { UsersUrls } from "../../common/models/UsersUrls.entity";
import { generateShortUrl } from "../../common/utils/generateShortUrl";

import { forbiddenError, internalServerErrorException } from "../../common/utils/requestsErrors";

@Injectable()
export class ShortfyService {

  constructor(
    @InjectRepository(Urls)
    private urlsRepository: Repository<Urls>,

    @InjectRepository(Users)
    private usersRepository: Repository<Users>,

    @InjectRepository(UsersUrls)
    private usersUrlsRepository: Repository<UsersUrls>
  ) {}
  

  /**
   * Creates a new short URL for a given long URL and optionally associates it with a user.
   * 
   * @param {string} longUrl - The long URL to be shortened.
   * @param {string} [ownerId] - The ID of the user to associate with the URL. Optional.
   * @returns {Promise<string>} A promise that resolves to the short URL.
   */
  public async createShortUrl(longUrl:string, ownerId?:string) {
    const savedUrl = await this.urlsRepository.save({
      long_url: longUrl,
      short_id: "",
    });

    this.addShortUrlKey(savedUrl);
    await this.urlsRepository.save(savedUrl);

    if(ownerId) await this.addOwner(savedUrl, ownerId);
    return generateShortUrl(savedUrl.short_id);
  }


  private addShortUrlKey(savedUrl:Urls) {
    try {
      const autoIncrementedId = savedUrl.id;
      const shortUrlKey = generateUrlKey(autoIncrementedId);
  
      savedUrl.short_id = shortUrlKey;
    }
    catch {
      throw internalServerErrorException("Max url limit hit, please try again later");
    }
  }


  private async addOwner(savedUrl:Urls, ownerId:string) {
    const user = await this.usersRepository.findOneBy({ id: ownerId });
    if(!user) return;

    const userUrl = this.usersUrlsRepository.create({
      user: user,
      url: savedUrl
    });

    await this.usersUrlsRepository.save(userUrl);
  }


  /**
   * Lists all shortened URLs associated with a given user ID.
   * 
   * @param {string} userId - The ID of the user to list URLs for.
   * @returns {Promise<any>} A promise that resolves to an array of shortened URLs.
   */
  public async listShortenUrls(userId:string) {
    const urls = await this.urlsRepository.find({
      where: { 
        deleted_at:IsNull(),
        usersUrls: {
          user: { id: userId }
        }
      },
      order: { created_at: "DESC" },
      select:[ "long_url", "id", "created_at", "updated_at", "short_id", "views" ]
    });

    return this.convertShortsKeysIntoShortUrl(urls);
  }


  private convertShortsKeysIntoShortUrl(urls:Urls[]) {
    const newData:object[] = [];

    for(const url of urls) {
      newData.push({
        longUrl:url.long_url,
        createAt:url.created_at,
        updateAt:url.updated_at,
        shortUrl:generateShortUrl(url.short_id),
        id:url.id,
        views:url.views
      });
    }

    return newData;
  }
  
  
  /**
   * Updates the long URL associated with a given user ID and URL ID.
   * 
   * @param {string} userId - The ID of the user who owns the URL.
   * @param {number} urlId - The ID of the URL to update.
   * @param {string} newOrigin - The new long URL to associate with the given URL ID.
   * @returns {Promise<{message: string, short_id: string, long_url: string}>} A promise that resolves to an object containing the update status, the short ID of the URL, and the new long URL.
   * @throws {Error} Throws an error if the user is not authorized to update the URL or if the URL was not found.
   */
  public async update(userId:string, urlId:number, newOrigin:string) {
    const userUrl = await this.usersUrlsRepository.findOne({
      where: {
        user: { id: userId },
        url: { id: urlId }
      },
      relations: [ "url" ],
    });
  
    
    if (!userUrl) throw forbiddenError("You are not authorized to update this URL or the URL was not found.", "url_id");

    const url = userUrl.url;
    url.long_url = newOrigin;
  
    await this.urlsRepository.save(url);
    return {
      message: "URL updated successfully",
      short_id: url.short_id,
      long_url: url.long_url,
    };
  }


  /**
   * Deletes a URL associated with a given user ID and URL ID.
   * 
   * @param {string} userId - The ID of the user who owns the URL.
   * @param {number} urlId - The ID of the URL to delete.
   * @returns {void} A promise that resolves when the URL is deleted.
   * @throws {Error} Throws an error if the user is not authorized to delete the URL or if the URL was not found.
   */
  public async delete(userId:string, urlId:number) {
    const userUrl = await this.usersUrlsRepository.findOne({
      where: {
        user: { id: userId },
        url: { id: urlId, deleted_at:IsNull() },
      },
      relations: [ "url" ]
    });

    if (!userUrl) throw forbiddenError("You are not authorized to delete this URL or the URL was not found.", "url_id");
    const url = userUrl.url;
    
    url.deleted_at = new Date();
    await this.urlsRepository.save(url);
  }
}
