import assert from "assert";
import fetch from "node-fetch";

const redirectURL = process.env.DISCORD_CALLBACK_URL;
const clientID = process.env.DISCORD_CLIENT_ID;
const clientSecret = process.env.DISCORD_CLIENT_SECRET;
assert(redirectURL, "DISCORD_CALLBACK_URL is not set");
assert(clientID, "DISCORD_CLIENT_ID is not set");
assert(clientSecret, "DISCORD_CLIENT_SECRET is not set");

export const getAccessToken = async (code: string) => {
  const oauthResult = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientID,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectURL,
      scope: "identify guilds",
    }),
  });
  const json = await oauthResult.json();
  return [json.token_type, json.access_token] as [
    string | undefined,
    string | undefined
  ];
};
