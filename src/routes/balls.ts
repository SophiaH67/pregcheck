import { Request, Response } from "express";

const params = {
  client_id: process.env.DISCORD_CLIENT_ID,
  redirect_uri: process.env.DISCORD_CALLBACK_URL,
  response_type: "code",
  scope: "identify guilds",
};
const redirectURL =
  `https://discord.com/api/oauth2/authorize?` +
  //@ts-ignore URLSearchParams is not properly typed
  new URLSearchParams(params).toString();

// balls.ts is the route to which the user gets redirected. Has ?redirect=<url>
export default (req: Request, res: Response) => {
  const redirect =
    (req.query.redirect as string) || "https://discord.com/invite/tjvcshD9FH";

  // Save the redirect url in the session
  req.session.redirect = redirect;

  // Redirect to discord auth
  res.redirect(redirectURL);
};
