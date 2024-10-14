import { InjectRepository } from "@nestjs/typeorm";

import { Inject, Injectable } from "@nestjs/common";
import { IsNull, Repository } from "typeorm";

import { notFoundError } from "./common/utils/requestsErrors";
import { Urls } from "./common/models/urls.entity";

import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(Urls)
    private urlRepository: Repository<Urls>,

    @Inject(CACHE_MANAGER) 
    private readonly cacheManager: Cache
  ) {}


  /**
   * Retrieves the long URL associated with a given short ID.
   * 
   * @param {string} shortId - The short ID of the URL.
   * @returns {Promise<string>} The long URL associated with the given short ID.
   * @throws {Error} Throws an error if the URL is not found or if it has been deleted.
   */
  public async getLongUrl(shortId:string) {
    let url = await this.getCachedLongUrl(shortId);

    if(!url || url.deleted_at) {
      url = await this.getUrlFromDatabase(shortId);
      if(url) await this.saveInChacheLongUrl(shortId, url);
    }

    if(!url || !url.long_url || url.deleted_at) throw notFoundError("Url not found");
    await this.updateViews(url.id);

    return url.long_url;
  }


  private async updateViews(urlId:number) {
    const url = await this.urlRepository.findOne({
      where:{ id:urlId, deleted_at:IsNull() },
      select:[ "views" ]
    });
    if(url) await this.urlRepository.update({ id: urlId }, { views: url.views + 1 });
  }


  private async getUrlFromDatabase(shortId:string) {
    return await this.urlRepository.findOne({
      where:{ short_id:shortId, deleted_at:IsNull() } ,
      select:[ "long_url", "views", "deleted_at", "id" ]
    });
  }


  private async getCachedLongUrl(shortId:string) {
    return this.cacheManager.get<Urls|null>(`${process.env.CACHE_URL_PREFIX}${shortId}`);
  }


  private async saveInChacheLongUrl(shortId:string, url:Urls) {
    const oneDayMs = 86400000;
    await this.cacheManager.set(`${process.env.CACHE_URL_PREFIX}${shortId}`, url, oneDayMs);
  }
}
