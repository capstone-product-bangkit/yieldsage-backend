

class UserEntity {
  user_id: string;
  name: string;
  email: string;
  password: string;
  phone_number: string;


  constructor(user_id: string, name: string, email: string, password: string, phone_number: string) {
    this.name = name;
    this.user_id = user_id;
    this.email = email;
    this.password = password;
    this.phone_number = phone_number;
  };
};

export {
  UserEntity
};