import { USER_DTO, UserRequest, UserResponse } from "../dto/UserDto";
import UserEntity from "../entities/UserEntity";
import { UserRepository } from "../repositories/UserRepository";

interface UserService {
  createUser(user: UserRequest): Promise<UserResponse | undefined>;
};

class UserServiceImpl implements UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async createUser(user: UserRequest): Promise<UserResponse | undefined> {
    const userData = new UserEntity(user.email, user.password);

    const response = await this.userRepository.createUser(userData);

    if (response !== undefined) {
      return new UserResponse(response?.email, response?.password);
    }
    
    return undefined;
  }
}

// Ekspor dengan cara yang benar
export { UserService, UserServiceImpl };