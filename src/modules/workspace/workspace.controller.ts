
import type { NextFunction, Request,Response } from "express";
import { workSpaceEnum } from "./workspace.interface";


const createWorkSpace = async (req:Request, res:Response, next:NextFunction)=>{
    try {
        
        const {type} =req.body;

        if(type===workSpaceEnum.family)
        {
            // workspace then
            // create family model

        }else{
            // workspace then
            // create student model

        }

        
    } catch (error) {
        next(error)
        
    }
}

const updateWorkSpace = async(req:Request, res:Response, next:NextFunction)=>{
    try {
        
    } catch (error) {

        next(error)
    }
}
const deleteWorkSpace=async (req:Request, res:Response, next:NextFunction)=>{
    try {
        
    } catch (error) {
        next(error)

        
    }
}


export const workSpaceController={
    createWorkSpace,updateWorkSpace,deleteWorkSpace
};