import { Schema, model } from "mongoose";
import { IWorkSpace } from "./workspace.interface";

const workspaceMemberSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
   rewardPoints:{
      type:Number,
      default:0
    },
    role: {
      type: String,
      enum: ["admin", "sub-admin", "user"],
      default: "user",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const workspaceSchema = new Schema<IWorkSpace>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    type: {
      type: String,
      enum: ["family", "student"],
      required: true,
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    categories:{
      type:[String],
      default:[]
    },
   
    members: {
      type: [workspaceMemberSchema],
      default: [],
    },

    isPrivate: {
      type: Boolean,
      default: true,
    },

    inviteCode: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


workspaceSchema.index(
  { _id: 1, "members.user": 1 },
  { unique: true, partialFilterExpression: { "members.user": { $exists: true } } }
);

export const WorkspaceModel = model<IWorkSpace>("Workspace", workspaceSchema);