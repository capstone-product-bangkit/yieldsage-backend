import bcrypt from "bcrypt";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { google } from "googleapis";
import { UserService } from "../services/UserService";
import { UserRequest } from "../dto/UserDto";
import jwt from "jsonwebtoken";
import { PasswordHelper } from "../helpers/PasswordHelper";
import Helper from "../helpers/Helper";

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
  include_granted_scopes: true,   
});

interface AuthController { 
  googleAuth(req: Request, res: Response): Promise<Response | any>;
  googleLogin(req: Request, res: Response): Promise<Response | any>;
}

class AuthControllerImpl {

  private userService: UserService;

  constructor(userService: UserService) { 
    this.userService = userService;
  }

  async googleAuth(req: Request, res: Response): Promise<Response | any> {
    return res.status(200).send({
      message: "Redirecting to Google Login",
      url: authorizationUrl,
    });
  }

  async googleLogin(req: Request, res: Response): Promise<Response | any> {
    try {
      const code = req.query.code as string;
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: "v2",
      });

      const { data } = await oauth2.userinfo.get();

      if (!data.email || !data.name) {
        return res.status(400).send({
          message: "Failed to get user info",
        });
      }

      // check data user in database mysql seauelize
      let email = data.email as string;
      let user = await this.userService.getUserByEmail(email);

      if (user === undefined) { 
        const hashPassword = await PasswordHelper.hash("123456");
        const userReq = new UserRequest(data.name as string, email, hashPassword, "");
        user = await this.userService.createUser(userReq);
      }

      const payload = {
        email: user?.email,
        name: user?.name,
      };


      const token = Helper.GenerateToken(payload);
      const refreshToken = Helper.GenerateRefreshToken(payload);

      const updateToken = await this.userService.updateAccessToken(email, token);

      if (updateToken === undefined) {
        return res.status(500).send({
          message: "Failed to update token",
        });
      }


      return res.json({
        message: "Login success",
        data: {
          token,
          refreshToken,
          user,
        },
      });

    } catch (error: any) {
      res.status(500).send({
        message: error.message,
        data: error,
      });
    }
  }
}


// Google Login
export {
  AuthController,
  AuthControllerImpl,
  authorizationUrl,
  oauth2Client,
};