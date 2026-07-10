
import { Schema, model } from "mongoose";
import { IWorkSpace } from "./workspace.interface";

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

    memberIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

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
    versionKey:false
  }
);

export const WorkspaceModel = model<IWorkSpace>(
  "Workspace",
  workspaceSchema
);