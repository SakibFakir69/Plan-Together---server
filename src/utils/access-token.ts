import dotenv from 'dotenv';
dotenv.config();

import jwt from "jsonwebtoken";
import UserModel, { IUserDocument } from "../modules/users/user.model";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const ACCESS_EXPIRES = "15m";


export const signAccessToken = (user: IUserDocument) =>{
  try {
    console.log(ACCESS_EXPIRES,ACCESS_SECRET,{ sub: user._id, role: user.role , email:user?.email })

   return jwt.sign(
  { sub: user._id, id: user?._id, role: user.role, email: user?.email, tokenVersion: user.refreshTokenVersion },
  ACCESS_SECRET,
  { expiresIn: ACCESS_EXPIRES }
);

    
  } catch (error) {
    console.log(error);
    
  }
}
