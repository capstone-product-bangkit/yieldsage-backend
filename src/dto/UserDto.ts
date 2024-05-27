
const USER_DTO = {
  MESSAGE_CREATE_USER_SUCCESS: 'User created successfully',
  MESSAGE_CREATE_USER_ERROR: 'Please provide an email and a password!',  
};


class UserRequest {
  email: string;
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

class UserResponse { 
  email: string;
  password?: string;

  constructor(email: string, password?: string) {
    this.email = email;
    this.password = password;
  }
}

export {
  UserRequest,
  UserResponse,
  USER_DTO,
};