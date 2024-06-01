const USER_DTO = {
  MESSAGE_CREATE_USER_SUCCESS: 'User created successfully',
  MESSAGE_CREATE_USER_ERROR: 'Please provide an email and a password!',
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
  email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
};

export {
  UserRequest,
  UserResponse,
  USER_DTO,
};