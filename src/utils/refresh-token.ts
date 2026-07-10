import dotenv from 'dotenv';
dotenv.config();

import jwt from "jsonwebtoken";
import UserModel, { IUserDocument } from "./../modules/users/user.model";

const REFRESH_SECRET = process.env.REFRESH_SECRET!;

const REFRESH_EXPIRES = "30d";


export const signRefreshToken = (user: IUserDocument) => {
  try {
    return jwt.sign(
      { sub: user._id, id: user?._id, role: user.role, email: user?.email, tokenVersion: user.refreshTokenVersion },
      REFRESH_SECRET,
      { expiresIn: REFRESH_EXPIRES }
    );
    

  } catch (error) {
  console.log(error)

}
}