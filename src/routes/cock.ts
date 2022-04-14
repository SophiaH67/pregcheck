import { Request, Response } from "express";
import { isAuthenticated, authSuccess } from "../auth";

// cock.ts is the route for the nginx auth check
export default (req: Request, res: Response) => {
  if (isAuthenticated(req)) {
    authSuccess(req);
    res.send("OK");
  } else {
    res.status(401).send("FAIL");
  }
};
