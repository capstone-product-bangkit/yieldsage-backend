import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface UserData {
  name: string | null,
  email: string | null,
}

const ResponseData = (status: number, message: any, error: any | null, data: any | null) => {
  if (error != null && error instanceof Error) {
    return {
      status: status,
      message: error.message,
      errors: error,
      data: null
    }
  }
  return {
    status: status,
    message: message,
    errors: error,
    data: data,
  }
};

const GenerateToken = (data: any): string => {
  return jwt.sign(data, process.env.JWT_SECRET as string, { expiresIn: '15m' });
}

const GenerateRefreshToken = (data: any): string => {
  return jwt.sign(data, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '3d' });
}

const ExtractToken = (token: string): UserData | null => {
  const secretKey = process.env.JWT_SECRET as string;

  let responseData: any;

  const res = jwt.verify(token, secretKey, (err, data) => { 
    if (err) {
      responseData = err;
    } else {
      responseData = data;
    }
  });

  if (responseData instanceof Error) {
    return null;
  } 
  
  const result: UserData = <UserData>(responseData);
  return result;
}

const ExtractRefreshToken = (token: string): UserData | null => {
  const secretKey = process.env.JWT_REFRESH_SECRET as string;

  let responseData: any;

  const res = jwt.verify(token, secretKey, (err, data) => { 
    if (err) {
      responseData = err;
    } else {
      responseData = data;
    }
  });

  if (responseData instanceof Error) {
    return null;
  } 
  
  const result: UserData = <UserData>(responseData);
  return result;
}

export default {
  ResponseData,
  GenerateToken,
  GenerateRefreshToken,
  ExtractToken,
  ExtractRefreshToken
};