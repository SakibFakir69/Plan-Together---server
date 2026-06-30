export interface IUser {
  id: string;                 
  email: string;                
  emailVerified: boolean;
  phone?: string;                
  phoneVerified?: boolean;


  passwordHash?: string;         
  authProvider: "local" | "google" | "facebook" | "apple";
  providerId?: string;           


  name: string;
  username?: string;           
  avatarUrl?: string;


  isActive: boolean;             
  isBanned: boolean;
  role: "user" | "admin" | "moderator";


  refreshTokenVersion: number;   
  lastLoginAt?: Date;
  lastLoginIp?: string;
  failedLoginAttempts: number;
  lockedUntil?: Date;            

  passwordResetToken?: string;
  passwordResetExpires?: Date;
  emailVerifyToken?: string;
  emailVerifyExpires?: Date;

 
  locale: string;                
  timezone?: string;
  pushToken?: string;            


  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;             
}


export interface IUserPublic {
  id: string;
  name: string;
  username?: string;
  avatarUrl?: string;

}