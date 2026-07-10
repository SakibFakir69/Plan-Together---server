import { Types } from "mongoose";

export type WorkSpaceType = "family" | "student";

export interface IWorkSpace {


  name: string;
  description?: string;
  type: WorkSpaceType;
  ownerId: Types.ObjectId;
  memberIds: Types.ObjectId[];
  isPrivate: boolean;
  inviteCode?: string;

  
 
}