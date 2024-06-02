

class UserEntity {
  name: string;
  email: string;
  password: string;
  phone_number: string;


  constructor(name: string, email: string, password: string, phone_number: string) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone_number = phone_number;
  };
};

export {
  UserEntity
};