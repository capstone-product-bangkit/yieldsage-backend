
const USER_TEST_DTO = {
  MESSAGE_CREATE_USER_SUCCESS: 'User created successfully',
  MESSAGE_CREATE_USER_ERROR: 'Please provide an email and a password!',  
};


class UserTestRequest {
  email: string;
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

class UserTestResponse { 
  email: string;
  password?: string;

  constructor(email: string, password?: string) {
    this.email = email;
    this.password = password;
  }
}

export {
  UserTestRequest,
  UserTestResponse,
  USER_TEST_DTO,
};