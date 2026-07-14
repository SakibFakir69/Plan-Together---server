
export interface ITask {
    _id: string;
    workspaceId: string;
    title: string;
    description?: string;
    category: string;
    assignedUser?: string;      
    createdBy: string;
    dueDate?: string;          
    isComplete: boolean;
    completedBy?: string;      
    completedAt?: string;   
    rewardPoints: number;
    createdAt: string;
    updatedAt: string;
}


export interface CreateTaskInput {
    title: string;
    description?: string;
    category: string;
    assignedUser?: string;
    dueDate?: string;
    rewardPoints?: number;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
    isComplete?: boolean;
}