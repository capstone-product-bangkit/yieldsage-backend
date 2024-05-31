import { DataTypes, Model, Optional } from 'sequelize';
import connection from '../../config/dbConnect';

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password?: string | null;
  phone_number?: string | null;

  createdAt?: Date;
  updatedAt?: Date;
}


export interface UserInput extends Optional<UserAttributes, 'id'> {

}

export interface UserOutput extends Required<UserAttributes> { }

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public phone_number!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
  sequelize: connection.sequelizeConnection,
  underscored: false,
});

export default User;