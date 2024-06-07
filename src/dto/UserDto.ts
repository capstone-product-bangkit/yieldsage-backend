const USER_DTO = {
  MESSAGE_CREATE_USER_SUCCESS: 'User created successfully',
  MESSAGE_CRED_ERROR: 'Please provide an email or phone number and a password!',
  MESSAGE_UNAUTHORIZED: 'UNAUTHORIZED',
  MESSAGE_INVALID_PASSWORD: 'INVALID PASSWORD',
  MESSAGE_USER_EXIST: 'User already exist!',
  MESSAGE_FAILED_CREATE_USER: 'Failed to create user!',
  MESSAGE_TOKEN_ERROR: 'Failed to update or create token!',
  MESSAGE_LOGIN_SUCCESS: 'Login success',
  MESSAGE_LOGIN_ERROR: 'Login failed',
  MESSAGE_USER_NOT_FOUND: 'User not found',
  MESSAGE_GET_USER_SUCCESS: 'Get user success',
  MESSAGE_GET_USER_ERROR: 'Get user failed',
  MESSAGE_REDIRECT: 'Redirect to google login',
};


class UserRequest {
  name: string;
  email: string;
  password: string;
  phone_number: string;

  constructor(name: string, email: string, password: string, phone_number: string) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone_number = phone_number;
  }
};

class UserResponse {
  name: string;
  user_id: string;
  email: string;

  constructor(user_id: string, name: string, email: string) {
    this.name = name;
    this.user_id = user_id;
    this.email = email;
  }
};



export {
  UserRequest,
  UserResponse,
  USER_DTO,
};