import fetch from "node-fetch";
import { ResourceObject, ResponseJSON, ResponseStatus } from "../Interfaces";
import Resource from "./Resource";

export default class Marketplace {
  private URLS: {
    ALL: string;
    MONTHLY: string;
    PERM: string;
  };
  constructor() {
    this.URLS = {
      ALL: "https://www.unrealengine.com/marketplace/api/assets?lang=en-US&start=0&count=100&sortBy=effectiveDate&sortDir=DESC&priceRange=[0,0]",
      MONTHLY:
        "https://www.unrealengine.com/marketplace/api/assets?lang=en-US&start=0&count=100&sortBy=effectiveDate&sortDir=DESC&tag[]=4910",
      PERM: "https://www.unrealengine.com/marketplace/api/assets?lang=en-US&start=0&count=100&sortBy=effectiveDate&sortDir=DESC&tag[]=4906",
    };
  }

  // TODO: fix this return type
  fetchAllLatest(): Promise<any> {
    return new Promise((resolve, reject) => {
      fetch(this.URLS.ALL)
        .then((res) => res.json())
        .then((res: ResponseJSON) => {
          if (res.status !== ResponseStatus.OK) reject(res);
          const resources: Resource[] = [];
          res.data.forEach((resource) => {
            resources.push(new Resource(resource));
          });

          resolve({
            ...res,
            data: resources,
          });
        })
        .catch(reject);
    });
  }

  fetchLatestMonthly() {
    return new Promise((resolve, reject) => {
      fetch(this.URLS.MONTHLY)
        .then((data) => data.json())
        .then((data) => {
          resolve(data);
        })
        .catch(reject);
    });
  }

  fetchLatestPerm() {
    return new Promise((resolve, reject) => {
      fetch(this.URLS.PERM)
        .then((data) => data.json())
        .then((data) => {
          resolve(data);
        })
        .catch(reject);
    });
  }
}
