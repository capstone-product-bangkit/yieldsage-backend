import { USER_TEST_DTO, UserTestRequest, UserTestResponse } from "../dto/UserTestDto";
import UserTestEntity from "../entities/UserTestEntity";
import { UserTestRepository } from "../repositories/UserTestRepository";

interface UserTestService {
  createUser(user: UserTestRequest): Promise<UserTestResponse | undefined>;
};

class UserTestServiceImpl implements UserTestService {
  private userTestRepository: UserTestRepository;

  constructor(userTestRepository: UserTestRepository) {
    this.userTestRepository = userTestRepository;
  }

  async createUser(user: UserTestRequest): Promise<UserTestResponse | undefined> {
    const userData = new UserTestEntity(user.email, user.password);

    const response = await this.userTestRepository.createUser(userData);

    if (response !== undefined) {
      return new UserTestResponse(response?.email, response?.password);
    }
    
    return undefined;
  }
}

// Ekspor dengan cara yang benar
export { UserTestService, UserTestServiceImpl };