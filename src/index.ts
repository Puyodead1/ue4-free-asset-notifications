import { Client, EmbedBuilder } from "discord.js";
import * as dotenv from "dotenv";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Entry } from "./Entry";
import { CheckType } from "./Interfaces";
import Marketplace from "./Marketplace";
import Resource from "./Resource";
import { error, info, warn } from "./utils";

dotenv.config({
  path: process.env.IS_DEVELOPMENT ? ".env.dev" : ".env",
});

if (!process.env.GUILD_ID) throw new Error("GUILD_ID not set in .env");
if (!process.env.CHANNELS_PERM)
  throw new Error("CHANNELS_PERM not set in .env");
if (!process.env.CHANNELS_MONTHLY)
  throw new Error("CHANNELS_MONTHLY not set in .env");
if (!process.env.TOKEN) throw new Error("TOKEN not set in .env");
if (!process.env.DATABASE_TYPE)
  warn("DATABASE_TYPE not set in .env, defaulting to sqlite");
if (!process.env.DATABASE_DATABASE)
  warn("DATABASE_HOST not set in .env, defaulting to database.db");

const dataSource = new DataSource({
  type: (process.env.DATABASE_TYPE as any) ?? "sqlite",
  host: process.env.DATABASE_HOST ?? "localhost",
  port: Number(process.env.DATABASE_PORT ?? 3306),
  username: process.env.DATABASE_USERNAME ?? "test",
  password: process.env.DATABASE_PASSWORD ?? "test",
  database: process.env.DATABASE_DATABASE ?? "database.db",
  synchronize: true,
  logging: process.env.DATABASE_DEBUG ? true : false ?? false,
  entities: [Entry],
  subscribers: [],
  migrations: [],
});

const marketplace = new Marketplace();
const client = new Client({
  intents: ["Guilds"],
});

async function notify(resource: Resource, type: CheckType) {
  const guild = client.guilds.cache.get(process.env.GUILD_ID!);
  if (!guild) {
    error("Guild not found.");
    return;
  }
  const channel = await guild.channels.fetch(process.env[`CHANNELS_${type}`]!);

  if (!channel || !channel.isTextBased()) {
    error("Channel not found or is not a text channel.");
    return;
  }

  const embed = new EmbedBuilder()
    .setAuthor({
      name: resource.seller.name,
      iconURL:
        "https://www.google.com/s2/favicons?sz=256&domain=https://www.unrealengine.com",
      url: `https://www.unrealengine.com/marketplace/en-US/seller/${resource.seller.name.replaceAll(
        " ",
        "+"
      )}`,
    })
    .setTitle(resource.title)
    .setDescription(resource.description.substring(0, 4096))
    .setURL(
      `https://www.unrealengine.com/marketplace/en-US/product/${resource.urlSlug}`
    )
    .addFields(
      {
        name: "Compatable Apps",
        value: resource.compatibleApps.length
          ? resource.compatibleApps.map((x) => `\`\`${x}\`\``).join(", ")
          : "N/A",
      },
      {
        name: "Categories",
        value: resource.categories.length
          ? resource.categories.map((x) => `\`\`${x.name}\`\``).join(", ")
          : "N/A",
      },
      {
        name: "Platforms",
        value: resource.platforms.length
          ? resource.platforms.map((x) => `\`\`${x.value}\`\``).join(", ")
          : "N/A",
      },
      {
        name: "Average Rating",
        value: resource.rating.averageRating.toString(),
      }
    )
    .setImage(encodeURI(resource.featured))
    .setThumbnail(encodeURI(resource.thumbnail))
    .setTimestamp(resource.effectiveDate);

  if (resource.discounted) {
    // calulate the discount percentage because epic is fucking stupid can't just set discountPercentage to 100 for temporary free shit
    embed.addFields({
      name: "Price",
      value: `~~$${resource.price}~~ **${
        resource.discountPrice
      }** (${Math.round(
        ((resource.priceValue - resource.discountPriceValue) /
          resource.priceValue) *
          100
      )}% off)`,
    });
  }
  const msg = await channel.send({
    embeds: [embed],
  });
  return msg.id;
}

async function addResources(
  resources: Resource[],
  type: CheckType,
  isInitalRun: boolean
) {
  let insertCount = 0;
  for (const resource of resources) {
    const exists = !!(await Entry.findOne({
      where: {
        id: resource.id,
      },
    }));
    if (exists) continue;
    const entry = new Entry();
    entry.id = resource.id;
    entry.slug = resource.urlSlug;
    entry.type = type;
    if (!isInitalRun) entry.messageId = await notify(resource, type);
    await entry.save();
    info(`Added ${resource.title} (${resource.id})`);
    insertCount++;
  }

  info(`Added ${insertCount} new ${type} entries.`);
}

async function run(isInitalRun = false) {
  const perm = await marketplace
    .fetchPerm()
    .catch((e) => error(`Error running permanently free check: ${e}`));
  if (perm) await addResources(perm, CheckType.PERM, isInitalRun);

  const monthly = await marketplace
    .fetchMonthly()
    .catch((e) => error(`Error running monthly free check: ${e}`));
  if (monthly) await addResources(monthly, CheckType.MONTHLY, isInitalRun);
}

client.on("ready", async () => {
  info(`Bot logged in and ready as ${client.user?.tag}`);

  info("Connected to database.");
  info("Starting inital run...");
  await run(true).catch(error);
  info("Inital run complete, next run in 1 hour.");

  setInterval(async () => {
    info("Starting scheduled run...");
    await run().catch((e) => error(`Error running scheduled run: ${e}`));
    info("Run complete.");
  }, 3.6e6); // 1 hour
});

// client.on("message", async (msg) => {
//   if (msg.author.id !== "213247101314924545") return console.error("user");
//   if (!msg.content.toLowerCase().startsWith("!")) return console.error("!");
//   const args = msg.content.toLowerCase().substr(1).split(" ");
//   const cmd = args.shift();

//   if (cmd === "search") {
//     const loadingMsg = await msg.reply("Searching...");
//     const results = await fetch<ResponseJSON>(
//       `https://www.unrealengine.com/marketplace/api/assets?lang=en-US&start=0&count=100&sortBy=relevancy&sortDir=DESC&keywords=${encodeURIComponent(
//         args.join(" ")
//       )}`,
//       FetchResultTypes.JSON
//     );
//     if (!results) {
//       loadingMsg.edit({ content: "Error searching for asset!" });
//       return;
//     }

//     const paginatedMessage = new PaginatedMessage();
//     for (const item of results.data.elements) {
//       paginatedMessage.addPageEmbed((embed: any) => {
//         return embed
//           .setTimestamp()
//           .setTitle(item.title)
//           .setDescription(item.description.substr(0, 2046))
//           .setImage(item.headerImage)
//           .addField(
//             "Price",
//             item.discounted
//               ? `~~${item.price}~~ ${item.discountPrice}`
//               : item.price
//           );
//       });
//     }

//     await paginatedMessage.run(loadingMsg, msg.author);
//     return;
//   }
// });

(async () => {
  await dataSource
    .initialize()
    .catch((e) => error(`Error connecting to database: ${e}`));

  client.login(process.env.TOKEN);
})();
