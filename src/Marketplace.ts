import { fetch, FetchResultTypes } from "@sapphire/fetch";
import { ResponseJSON, ResponseStatus } from "./Interfaces";
import Resource from "./Resource";

export default class Marketplace {
  private URLS: {
    ALL: string;
    MONTHLY: string;
    PERM: string;
  };
  constructor() {
    this.URLS = {
      ALL: "https://www.unrealengine.com/marketplace/api/assets?start=0&count=100",
      MONTHLY:
        "https://www.unrealengine.com/marketplace/api/assets?start=0&count=100&tag[]=4910",
      PERM: "https://www.unrealengine.com/marketplace/api/assets?start=0&count=100&tag[]=4906",
    };
  }

  fetchPerm(): Promise<Resource[]> {
    return new Promise((resolve, reject) => {
      fetch<ResponseJSON>(this.URLS.PERM, FetchResultTypes.JSON)
        .then((res) => {
          if (res.status !== ResponseStatus.OK) reject(res);
          const resources: Resource[] = [];
          res.data.elements.forEach((resource) => {
            resources.push(new Resource(resource));
          });

          resolve(resources);
        })
        .catch(reject);
    });
  }

  fetchMonthly(): Promise<Resource[]> {
    return new Promise((resolve, reject) => {
      fetch<ResponseJSON>(this.URLS.MONTHLY, FetchResultTypes.JSON)
        .then((res) => {
          if (res.status !== ResponseStatus.OK) reject(res);
          const resources: Resource[] = [];
          res.data.elements.forEach((resource) => {
            resources.push(new Resource(resource));
          });

          resolve(resources);
        })
        .catch(reject);
    });
  }
}
