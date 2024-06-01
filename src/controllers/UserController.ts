import { UserRequest } from "../dto/UserDto";
import Helper from "../helpers/Helper";
import { PasswordHelper } from "../helpers/PasswordHelper";
import { UserService } from "../services/UserService";
import { Request, Response } from "express";

interface UserController {
  register(req: Request, res: Response): Promise<Response>;
  login(req: Request, res: Response): Promise<Response>;
  getMe(req: Request, res: Response): Promise<Response>;
};

class UserControllerImpl implements UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async register(req: Request, res: Response): Promise<Response | any> {
    try {
      const {name, email, password, phone_number} = req.body;

      if (!email || !password) {
        return res.status(400).send({
          message: "Please provide an email and a password!",
        });
      }

      let check = await this.userService.getUserByEmail(email);

      if (check !== undefined) {
        return res.status(400).send({
          message: "User already exist!",
        });
      }

      const hashPassword = await PasswordHelper.hash(password);

      const user = new UserRequest(name, email, hashPassword, phone_number);

      const response = await this.userService.createUser(user);

      if (response !== undefined) {
        return res.status(201).send({
          message: "User created successfully!",
          data: response,
        });
      }


      res.status(500).send({
        message: "Failed to create user!",
      });

    } catch (error: any) {
      res.status(500).send({
        message: error.message,
        data: error,
      });
    }
  }
  
  async login(req: Request, res: Response): Promise<Response | any> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).send({
          message: "Please provide an email or phone number and a password!",
        });
      }

      const user = await this.userService.getUserByEmail(email);

      if (user === undefined) {
        return res.status(401).send({
          message: "UNAUTHORIZED",
        });
      }

      const userPassword = await this.userService.getUserPasswordByEmail(email);

      if (userPassword === undefined) {
        return res.status(401).send({
          message: "UNAUTHORIZED",
        });
      }

      const isPasswordValid = await PasswordHelper.compare(password, userPassword);

      if (!isPasswordValid) {
        return res.status(400).send({
          message: "INVALID PASSWORD",
        });
      }

      const dataUser = {
        name: user.name,
        email: user.email,
      };

      const token = Helper.GenerateToken(dataUser);
      const refreshToken = Helper.GenerateRefreshToken(dataUser);
      
      const updateToken = await this.userService.updateAccessToken(email, token);

      if (updateToken === undefined) {
        return res.status(500).send({
          message: "Failed to update token!",
        });
      }

      return res.status(200).send({
        message: "Login success",
        data: {
          token,
          refreshToken,
          user: dataUser,
        },
      });

    } catch (error: any) {
      res.status(500).send({
        message: error.message,
        data: error,
      });
    }
  }

  async getMe(req: Request, res: Response): Promise<Response | any> {
    try {
      const user = res.locals.user;

      const check = await this.userService.getUserByEmail(user.email);

      if (check === undefined) {
        return res.status(401).send({
          message: "UNAUTHORIZE!",
        });
      }

      return res.status(200).send({
        message: "User data",
        data: user,
      });

    } catch (error: any) {
      res.status(500).send({
        message: error.message,
        data: error,
      });
    }
  }
}

export {
  UserController,
  UserControllerImpl
};