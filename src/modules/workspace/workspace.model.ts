



import mongoose, { model, Mongoose, Schema, SchemaType } from "mongoose";
import { IWorkSpace } from "./workspace.interface";

enum WorkSpace{
    "FAMILY"="Family",
    "STUDENT"="Student"
}

const WorkSpaceSchema = new Schema<IWorkSpace>({
    name:{
        type:String,
        required:true,
    },
    ownerId:{
        type:String,
        required:true,
        index:true,
        default:Schema.Types.ObjectId

    },
    type:{
        type:String,
        required:true,
        enum:Object.values(WorkSpace),
        default:WorkSpace.FAMILY

    }



},{timestamps:true,versionKey:false}) 


export const WorkSpace = model<"WorkSpace", Workspace>