import { InjectRepository } from "@nestjs/typeorm";

import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

import { notFoundError } from "./common/utils/requestsErrors";
import { Urls } from "./common/models/urls.entity";

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(Urls)
    private urlRepository: Repository<Urls>,
  ) {}


  /**
   * Retrieves the long URL associated with a given short ID.
   * 
   * @param {string} shortId - The short ID of the URL.
   * @returns {Promise<string>} The long URL associated with the given short ID.
   * @throws {Error} Throws an error if the URL is not found or if it has been deleted.
   */
  public async getLongUrl(shortId:string) {
    const url = await this.urlRepository.findOne({
      where:{ short_id:shortId },
      select:[ "long_url", "views", "deleted_at" ]
    });

    if(!url || !url.long_url || url.deleted_at) throw notFoundError("Url not found");
    await this.urlRepository.update({ short_id: shortId }, { views: url.views + 1 });
    
    return url.long_url;
  }

}
