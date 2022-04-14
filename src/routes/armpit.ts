import fetch from "node-fetch";
import { Request, Response } from "express";
import { getAccessToken } from "../discord";
import { authSuccess } from "../auth";

// armpit.ts is the route to which discord redirects.
export default async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const redirect =
    req.session.redirect || "https://discord.com/invite/tjvcshD9FH";
  if (!code) {
    res.send("No code").status(400);
    return;
  }

  // Get the access token
  const [tokenType, accessToken] = await getAccessToken(code);
  if (!tokenType || !accessToken) {
    res.send("No token?").status(400);
    return;
  }

  // Get person from discord
  const user = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `${tokenType} ${accessToken}`,
    },
  }).then((res) => res.json());

  // Get server list from discord
  const guilds = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: {
      Authorization: `${tokenType} ${accessToken}`,
    },
  }).then((res) => res.json());

  // Check if user is in guild with id "842375042972385320"
  const inGuild = guilds.some(
    (g: { id: string }) => g.id === "880994977402990663"
  );
  if (inGuild) {
    authSuccess(req);
    res.redirect(redirect);
  } else {
    res.send("Not in guild").status(401);
  }
};
