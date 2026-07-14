import { Schema, model, Types, Document } from "mongoose";

export interface ITask extends Document {
    workspaceId: Types.ObjectId;
    title: string;
    description?: string;
    category: string;
    assignedUser?: Types.ObjectId;  
    createdBy: Types.ObjectId;
    dueDate?: Date;
    isComplete: boolean;
    completedBy?: Types.ObjectId;     
    completedAt?: Date;
    rewardPoints: number;            
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
    {
        workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
        title: { type: String, required: true, trim: true },
        description: { type: String },
        category: { type: String, required: true },
        assignedUser: { type: Schema.Types.ObjectId, ref: "User" },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        dueDate: { type: Date },
        isComplete: { type: Boolean, default: false },
        completedBy: { type: Schema.Types.ObjectId, ref: "User" },
        completedAt: { type: Date },
        rewardPoints: { type: Number, default: 0, min: 0 },
    },
    { timestamps: true }
);

TaskSchema.index({ workspaceId: 1, isComplete: 1 });
TaskSchema.index({ assignedUser: 1 });
TaskSchema.index({ workspaceId: 1, category: 1 });

export const TaskModel = model<ITask>("Task", TaskSchema);