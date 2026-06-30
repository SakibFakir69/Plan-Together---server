import mongoose, { Schema, Document, CallbackWithoutResultAndOptionalError } from "mongoose";
import bcrypt from "bcrypt";

export interface IUserDocument extends Document {
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

  deletedAt?: Date;

  comparePassword(candidate: string): Promise<boolean>;
  toPublicJSON(): Record<string, unknown>;
}

const userSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    emailVerified: { type: Boolean, default: false },
    phone: { type: String, unique: true, sparse: true },
    phoneVerified: { type: Boolean, default: false },

    passwordHash: { type: String, select: false },
    authProvider: { type: String, enum: ["local", "google", "facebook", "apple"], default: "local" },
    providerId: { type: String, index: true, sparse: true },

    name: { type: String, required: true, trim: true },
    username: { type: String, unique: true, sparse: true, trim: true },
    avatarUrl: { type: String },

    isActive: { type: Boolean, default: true },
    isBanned: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin", "moderator"], default: "user" },

    refreshTokenVersion: { type: Number, default: 0 },
    lastLoginAt: { type: Date },
    lastLoginIp: { type: String },
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date },

    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date },
    emailVerifyToken: { type: String, select: false },
    emailVerifyExpires: { type: Date },

    locale: { type: String, default: "en" },
    timezone: { type: String },
    pushToken: { type: String },

    deletedAt: { type: Date },
  },
  { timestamps: true }
);


userSchema.pre("save", async function (this: IUserDocument) {
  if (!this.isModified("passwordHash") || !this.passwordHash) return;
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
})


userSchema.methods.comparePassword = function (
  this: IUserDocument,
  candidate: string
): Promise<boolean> {
  return bcrypt.compare(candidate, this.passwordHash as string);
};

userSchema.methods.toPublicJSON = function (this: IUserDocument) {
  return {
    id: this._id,
    name: this.name,
    username: this.username,
    avatarUrl: this.avatarUrl,
    role: this.role,
  };
};

export default mongoose.model<IUserDocument>("User", userSchema);