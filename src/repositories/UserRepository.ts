import User from "../db/models/User";
import { UserEntity } from "../entities/UserEntitty";
import { PasswordHelper } from "../helpers/PasswordHelper";
import connection from "../config/dbConnect";

interface UserRepository {
  createUser(user: UserEntity): Promise<UserEntity | undefined>;
  getUserByEmail(email: string): Promise<UserEntity | undefined>;
  getUserPasswordByEmail(email: string): Promise<string | undefined>;
  updateAccessToken(email: string, accessToken: string): Promise<UserEntity | undefined>;
}

class UserRepositoryImpl implements UserRepository {

  async createUser(user: UserEntity): Promise<UserEntity | undefined> {
    try {
      if (!user.email || !user.password || !user.phone_number || !user.name) {
        return undefined;
      }
      
      const newUser = await User.create({
        id: user.user_id as string, 
        email: user.email,
        password: user.password,
        phone_number: user.phone_number,
        name: user.name
      });

      return new UserEntity(user.user_id, newUser.name, newUser.email, newUser.password, newUser.phone_number);
      
    } catch (error: any) {
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<UserEntity | undefined> {
    try {
      if (!email) {
        return undefined;
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return undefined;
      }

      return new UserEntity(user.id, user.name, user.email, user.password, user.phone_number);
    } catch (error: any) {
      return undefined;
    }
  }

  async getUserPasswordByEmail(email: string): Promise<string | undefined> {
    try {
      if (!email) {
        return undefined;
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return undefined;
      }

      return user.password;

    } catch (error: any) {
      return undefined;
    }
  }

  async updateAccessToken(email: string, accessToken: string): Promise<UserEntity | undefined> {

    try {
      if (!email) {
        return undefined;
      }
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return undefined;
      }
      user.accessToken = accessToken;
      await user.save();
      return new UserEntity(user.id, user.email, user.password, user.phone_number, user.name);

    } catch (error: any) {
      console.error("Error occurred after raw query execution:", error.message, error);
      return undefined;
    }
  }
};

export {
  UserRepository,
  UserRepositoryImpl,
};