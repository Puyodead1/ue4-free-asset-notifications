import { Client, ClientOptions } from "discord.js";
import { Collection, Db } from "mongodb";

export default class CustomClient extends Client {
  public mongoDb?: Db;
  public mongoCollection?: Collection;
  constructor(options: ClientOptions) {
    super(options);
  }

  setMongoDB(db: Db) {
    this.mongoDb = db;
  }

  setMongoCollection(collection: Collection) {
    this.mongoCollection = collection;
  }
}
