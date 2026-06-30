


import mongoose from "mongoose";



const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    emailVerified: { type: Boolean, default: false },
    phone: { type: String, unique: true, sparse: true },
    phoneVerified: { type: Boolean, default: false },

    passwordHash: { type: String, select: false }, // omitted from queries by default
    authProvider: { type: String, enum: ["local", "google", "facebook", "apple"], default: "local" },
    providerId: { type: String, index: true, sparse: true },

    name: { type: String, required: true, trim: true },
    username: { type: String, unique: true, sparse: true, trim: true },
    avatarUrl: { type: String },

    isActive: { type: Boolean, default: true },
    isBanned: { type: Boolean, default: false },
  

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
  { timestamps: true ,versionKey:false} 
);

// Hash password before save (only if local auth + password changed)
userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash") || !this.passwordHash) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

// Strip sensitive fields when sending to client
userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    name: this.name,
    username: this.username,
    avatarUrl: this.avatarUrl,
    role: this.role,
  };
};

export const user = mongoose.model("User", userSchema);