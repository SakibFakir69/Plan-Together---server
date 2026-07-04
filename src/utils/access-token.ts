
import jwt from "jsonwebtoken";
import UserModel, { IUserDocument } from "../modules/users/user.model";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const ACCESS_EXPIRES = "15m";


export const signAccessToken = (user: IUserDocument) =>
  jwt.sign({ sub: user._id, role: user.role , email:user?.email }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });

