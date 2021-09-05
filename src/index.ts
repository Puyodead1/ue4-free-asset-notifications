import Discord, { MessageEmbed } from "discord.js";
import Marketplace from "./Classes/Marketplace";
import Resource from "./Classes/Resource";
import config from "./config";
import { MongoClient, ObjectId } from "mongodb";
import { CheckType } from "./Interfaces";
import CustomClient from "./Classes/CustomClient";
import fetch from "node-fetch";
import { PaginatedMessage } from "@sapphire/discord.js-utilities";

const client = new CustomClient({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"],
});
const marketplace = new Marketplace();

// const mongoClient = new MongoClient(config.mongodb.uri);

async function notify(resource: Resource, type: CheckType) {
  const guild = client.guilds.cache.get(config.server);
  if (!guild) return console.error("Guild not found, check ID.");
  const channel = await guild.channels.fetch(config.channels[type]);

  if (!channel || !channel.isText())
    return console.error("Channel not found or is not a text channel.");

  const embed = new MessageEmbed()
    .setTitle(resource.title)
    .setDescription(resource.description.substr(0, 4096))
    .setFooter(`Submitted by ${resource.seller.name}`)
    .setURL(
      `https://www.unrealengine.com/marketplace/en-US/product/${resource.urlSlug}`
    )
    .addField(
      "Compatable Apps",
      resource.compatibleApps.length
        ? resource.compatibleApps.map((x) => `\`\`${x}\`\``).join(", ")
        : "N/A"
    )
    .addField(
      "Categories",
      resource.categories.length
        ? resource.categories.map((x) => `\`\`${x.name}\`\``).join(", ")
        : "N/A"
    )
    .addField(
      "Platforms",
      resource.platforms.length
        ? resource.platforms.map((x) => `\`\`${x.value}\`\``).join(", ")
        : "N/A"
    )
    .addField("Average Rating", resource.rating.averageRating.toString())
    .setImage(encodeURI(resource.featured))
    .setThumbnail(encodeURI(resource.thumbnail))
    .setTimestamp(resource.effectiveDate);
  await channel.send({
    embeds: [embed],
  });
}

async function processResouces(resources: Resource[], type: CheckType) {
  for (const resource of resources) {
    // await notify(resource, type);
    await client.mongoCollection
      ?.insertOne({
        _id: new ObjectId(resource.id),
        slug: resource.urlSlug,
        type,
      })
      .then(() => console.log(`Inserted ${resource.title} (${resource.id})`))
      .catch(console.error);
  }
}

async function run() {
  const perm = await marketplace.fetchPerm().catch(console.error);
  if (!perm) return;

  await processResouces(perm, CheckType.PERM);

  const monthly = await marketplace.fetchMonthly().catch(console.error);
  if (!monthly) return;

  await processResouces(monthly, CheckType.MONTHLY);
}

client.on("ready", async () => {
  console.log("Bot is now ready");
  // await mongoClient.connect().catch((reason) => {
  //   console.error(`Failed to connect to MongoDB: ${reason}`);
  //   client.destroy();
  //   process.exit(1);
  // });
  // console.log("Successfully connected to MongoDB!");
  // const db = mongoClient.db();
  // const collection = db.collection("documents");
  // client.setMongoDB(db);
  // client.setMongoCollection(collection);

  // console.log("Starting inital run...");
  // await run().catch(console.error);
  // console.log("Inital run complete");
  // setInterval(async () => {
  //   console.log("Starting scheduled run...");
  //   await run().catch(console.error);
  //   console.log("Run complete.");
  // }, 10 * 60000); // 10 minutes
});

client.on("message", async (msg) => {
  if (msg.author.id !== "213247101314924545") return console.error("user");
  if (!msg.content.toLowerCase().startsWith("!")) return console.error("!");
  const args = msg.content.toLowerCase().substr(1).split(" ");
  const cmd = args.shift();

  if (cmd === "search") {
    const loadingMsg = await msg.reply("Searching...");
    const results = await fetch(
      `https://www.unrealengine.com/marketplace/api/assets?lang=en-US&start=0&count=100&sortBy=relevancy&sortDir=DESC&keywords=${encodeURIComponent(
        args.join(" ")
      )}`
    );
    if (!results) {
      loadingMsg.edit({ content: "Error searching for asset!" });
      return;
    }

    const json = await results.json();
    const paginatedMessage = new PaginatedMessage();
    for (const item of json.data.elements) {
      paginatedMessage.addPageEmbed((embed) => {
        return embed
          .setTimestamp()
          .setTitle(item.title)
          .setDescription(item.description.substr(0, 2046))
          .setImage(item.headerImage)
          .addField(
            "Price",
            item.discounted
              ? `~~${item.price}~~ ${item.discountPrice}`
              : item.price
          );
      });
    }

    await paginatedMessage.run(loadingMsg, msg.author);
    return;
  }
});

client.login(config.token);
