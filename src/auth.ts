import { Request, Response } from "express";

export const isAuthenticated = (req: Request) => {
  const lastAuth = req.session.lastAuth;
  if (!lastAuth) {
    return false;
  }
  const lastAuthDate = new Date(lastAuth);
  // Auth expires after 1 hour
  const authExpiration = 1000 * 60 * 60;
  const now = Date.now();
  return now - lastAuthDate.getTime() < authExpiration;
};

export const authSuccess = (req: Request) => {
  req.session.lastAuth = new Date().toISOString();
};
