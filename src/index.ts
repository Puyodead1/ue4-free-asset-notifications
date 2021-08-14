import Discord from "discord.js";
import config from "./config";

const client = new Discord.Client({
  intents: Discord.Intents.FLAGS.GUILD_MESSAGES,
});

client.login(config.token);
