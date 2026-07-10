import type { NextFunction, Request, Response } from "express";
import { workSpaceEnum } from "./workspace.interface";
import { createWorkspaceValidation } from "./workspace.validation";
import { WorkspaceModel } from "./workspace.model";
import httpStatus from "http-status";
import { generateInviteCode } from "../../utils/genrate-invite-code";



const createWorkSpace = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const parsedData = createWorkspaceValidation.parse({
            body: req.body,
        });

        const { name, description, type, isPrivate, inviteCode } =
            parsedData.body;

        const ownerId = req.user?.id; // set by your auth middleware

        if (!ownerId) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const finalInviteCode = inviteCode ?? generateInviteCode();

        // Guard against invite code collisions
        const existing = await WorkspaceModel.findOne({
            inviteCode: finalInviteCode,
        });
        if (existing) {
            return res.status(httpStatus.CONFLICT).json({
                success: false,
                message: "Invite code already in use, please try again.",
            });
        }

        const basePayload = {
            name,
            description,
            isPrivate: isPrivate ?? false,
            inviteCode: finalInviteCode,
            owner: ownerId,
            members: [{ user: ownerId, role: "owner" }],
        };

        let workspace;

        if (type === workSpaceEnum.family) {
            workspace = await WorkspaceModel.create({
                ...basePayload,
                type: workSpaceEnum.family,
                // family-specific defaults
                allowance: { enabled: false },
            });
        } else if (type === workSpaceEnum.student) {
            workspace = await WorkspaceModel.create({
                ...basePayload,
                type: workSpaceEnum.student,
                // student-specific defaults
                semester: null,
            });
        } else {
            return res.status(httpStatus.BAD_REQUEST).json({
                success: false,
                message: "Invalid workspace type.",
            });
        }

        return res.status(httpStatus.CREATED).json({
            success: true,
            message: "Workspace created successfully",
            data: workspace,
        });
    } catch (error) {
        next(error);
    }
};



const updateWorkSpace = async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {

        next(error)
    }
}
const deleteWorkSpace = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if(!userId)
        {
            return 
        }

    } catch (error) {
        next(error)


    }
}


const getMyAllWorkSpace = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const allWorkSpaceData = await WorkspaceModel.find().lean();
        if(!allWorkSpaceData)
        {
            return res.status(404).json({
                success:false,
                message:"No workspace found"
            })
        }
        return res.status(200).json({
            success:true,
            data:allWorkSpaceData
        })

    } catch (error) {
        next(error)


    }
}


export const workSpaceController = {
    createWorkSpace, updateWorkSpace, deleteWorkSpace,getMyAllWorkSpace
};