import { Request, Response, NextFunction } from "express";
import Helper from "../helpers/Helper";

const AuthenticateJwt = (req: Request, res: Response, next: NextFunction) => { 
  try {
    const authToken = req.header("Authorization");
    const token = authToken?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).send({
        message: "UNAUTHORIZED",
      });
    }

    const result = Helper.ExtractToken(token);

    if (result === null) {
      return res.status(401).send({
        message: "UNAUTHORIZED",
      });
    }

    res.locals.user = result;
    next();
  } catch (error: any) {
    res.status(500).send({
      message: error.message,
    });
  }
};

export {
  AuthenticateJwt,
};