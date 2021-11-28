const config = {
  token: process.env.TOKEN ?? "bot token",
  channels: {
    PERM_FREE: process.env.PERM_FREE_CHANNEL_ID ?? "876896848617537537",
    MONTHLY: process.env.FREE_MONTH_CHANNEL_ID ?? "876896827218223145",
  },
  server: process.env.SERVER_ID ?? "638455519652085780",
  mongodb: {
    uri: process.env.MONGODB_URI ?? "mongodb uri",
  },
};

export default config;
