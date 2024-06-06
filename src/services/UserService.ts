import { UserRequest, UserResponse } from "../dto/UserDto";
import { UserEntity } from "../entities/UserEntitty";
import { UserRepository } from "../repositories/UserRepository";
import { v4 as uuidv4 } from 'uuid';


interface UserService { 
  createUser(user: UserRequest): Promise<UserResponse | undefined>;
  getUserByEmail(email: string): Promise<UserResponse | undefined>;
  getUserPasswordByEmail(email: string): Promise<string | undefined>;
  updateAccessToken(email: string, accessToken: string): Promise<UserResponse | undefined>;
};

class UserServiceImpl implements UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async createUser(user: UserRequest): Promise<UserResponse | undefined> {
    const user_id = uuidv4();

    const userData = new UserEntity(user_id, user.name, user.email, user.password, user.phone_number);

    const response = await this.userRepository.createUser(userData);

    if (response !== undefined) {
      return new UserResponse(response!.user_id, response!.name, response!.email);
    }
    
    return undefined;
  }

  async getUserByEmail(email: string): Promise<UserResponse | undefined> {
    const response = await this.userRepository.getUserByEmail(email);

    if (response !== undefined) {
      return new UserResponse(response!.user_id ,response!.name, response!.email);
    }

    return undefined;
  }

  async getUserPasswordByEmail(email: string): Promise<string | undefined> {
    return await this.userRepository.getUserPasswordByEmail(email);
  }

  async updateAccessToken(email: string, accessToken: string): Promise<UserResponse | undefined> {
    const response = await this.userRepository.updateAccessToken(email, accessToken);

    if (response !== undefined) {
      return new UserResponse(response!.user_id ,response!.name, response!.email);
    }

    return undefined;
  }
};

export {
  UserService,
  UserServiceImpl
};