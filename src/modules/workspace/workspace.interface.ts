// workspace.interface.ts
import { Types } from "mongoose";

export const workSpaceEnum = {
  family: "family",
  student: "student",
} as const;

export const memberRoleEnum = {
  admin: "admin",
  subAdmin: "sub-admin",
  user: "user",
} as const;

export interface IWorkspaceMember {
  user: Types.ObjectId;
  role: "admin" | "sub-admin" | "user";
  rewardPoints:number,
  joinedAt?: Date;
}

export interface IWorkSpace {
  name: string;
  description?: string;
  type: (typeof workSpaceEnum)[keyof typeof workSpaceEnum];
  ownerId: Types.ObjectId;
  members: IWorkspaceMember[];
  isPrivate: boolean;
  inviteCode?: string;
  categories: string[]
}