
import jwt from "jsonwebtoken";
import UserModel, { IUserDocument } from "./../modules/users/user.model";

const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

const REFRESH_EXPIRES = "30d";


export const signRefreshToken = (user: IUserDocument) =>
  jwt.sign(
    { sub: user._id, v: user.refreshTokenVersion },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES }
  );