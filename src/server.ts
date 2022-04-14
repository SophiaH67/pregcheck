import "dotenv/config";
import express from "express";
import connectRedis from "connect-redis";
import session from "express-session";
const RedisStore = connectRedis(session);
import { createClient } from "redis";
import fs from "fs";
import { join } from "path";

const app = express();
let redisClient = createClient({ legacyMode: true });
redisClient.connect().catch(console.error);

declare module "express-session" {
  interface SessionData {
    discordToken?: string;
    lastAuth?: string;
    redirect?: string;
  }
}

app.use(
  session({
    secret: "secret balls",
    store: new RedisStore({ client: redisClient }),
    resave: true,
    saveUninitialized: false,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Loop over ./routes and import each one (.js and .ts)
const routesFolder = join(__dirname, "routes");
console.log(`Scanning ${routesFolder} for routes...`);
for (const file of fs.readdirSync(routesFolder)) {
  if (!file.endsWith(".js") && !file.endsWith(".ts")) {
    continue;
  }
  console.log(`Importing ${file}...`);
  const reqHandler = require(join(routesFolder, file)).default;
  const route = file.replace(/\.ts$/, "").replace(/\.js$/, "");
  app.get(`/${route}`, reqHandler);
}

app.listen(3000, () => {
  console.log("Example app listening on port http://0.0.0.0:3000!");
});
