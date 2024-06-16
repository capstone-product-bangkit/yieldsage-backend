import { USER_DTO, UserRequest } from "../dto/UserDto";
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

      if (!email || !password || !name || !phone_number) {
        return res.status(400).send(Helper.ResponseData(400, USER_DTO.MESSAGE_CRED_ERROR, true, null));
      } 

      let check = await this.userService.getUserByEmail(email);

      if (check !== undefined) {
        return res.status(400).send(Helper.ResponseData(400, USER_DTO.MESSAGE_USER_EXIST, true, null));
      }

      const hashPassword = await PasswordHelper.hash(password);

      const user = new UserRequest(name, email, hashPassword, phone_number);

      const response = await this.userService.createUser(user);

      if (response !== undefined) {
        return res.status(201).send(Helper.ResponseData(201, USER_DTO.MESSAGE_CREATE_USER_SUCCESS, false, response));
      }

      return res.status(500).send(Helper.ResponseData(500, USER_DTO.MESSAGE_FAILED_CREATE_USER, true, null));

    } catch (error: any) {
      return res.status(500).send(Helper.ResponseData(500, error.message, true, error));
    }
  }
  
  async login(req: Request, res: Response): Promise<Response | any> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).send(Helper.ResponseData(400, USER_DTO.MESSAGE_CRED_ERROR, true, null));
      }

      const user = await this.userService.getUserByEmail(email);

      if (user === undefined) {
        return res.status(401).send(Helper.ResponseData(401, USER_DTO.MESSAGE_UNAUTHORIZED, true, null));
      }

      const userPassword = await this.userService.getUserPasswordByEmail(email);

      if (userPassword === undefined) {
        return res.status(401).send(Helper.ResponseData(401, USER_DTO.MESSAGE_UNAUTHORIZED, true, null));
      }

      const isPasswordValid = await PasswordHelper.compare(password, userPassword);

      if (!isPasswordValid) {
        return res.status(400).send(Helper.ResponseData(400, USER_DTO.MESSAGE_INVALID_PASSWORD, true, null));
      }

      const dataUser = {
        name: user.name,
        email: user.email,
        user_id: user.user_id,
      };

      const token = Helper.GenerateToken(dataUser);
      const refreshToken = Helper.GenerateRefreshToken(dataUser);
      
      const updateToken = await this.userService.updateAccessToken(email, token);

      if (updateToken === undefined) {
        return res.status(500).send(Helper.ResponseData(500, USER_DTO.MESSAGE_TOKEN_ERROR, true, null));
      }

      const responseData = {
        token,
        refreshToken,
        user: dataUser,
      };

      return res.status(200).send(Helper.ResponseData(200, USER_DTO.MESSAGE_LOGIN_SUCCESS, false ,responseData));

    } catch (error: any) {
      return res.status(500).send(Helper.ResponseData(500, USER_DTO.MESSAGE_LOGIN_ERROR, true, error));
    }
  }

  async getMe(req: Request, res: Response): Promise<Response | any> {
    try {
      const user = res.locals.user;

      const check = await this.userService.getUserByEmail(user.email);

      if (check === undefined) {
        return res.status(401).send(Helper.ResponseData(401, USER_DTO.MESSAGE_UNAUTHORIZED, true, null));
      }

      const responseData =
      {
        name: check.name,
        email: check.email,
        phone_number: check.phone_number,
      };

      return res.status(200).send(Helper.ResponseData(200, USER_DTO.MESSAGE_GET_USER_SUCCESS, false, responseData));

    } catch (error: any) {
      return res.status(500).send(Helper.ResponseData(500, USER_DTO.MESSAGE_GET_USER_ERROR, true, error));
    }
  }
}

export {
  UserController,
  UserControllerImpl
};