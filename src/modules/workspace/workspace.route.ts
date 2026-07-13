import { Router } from "express";
import { workSpaceController } from "./workspace.controller";
import { requireAuth } from "../../middlewares";



const router = Router();



router.post('/',requireAuth, workSpaceController.createWorkSpace)
router.put('/:workspaceId',workSpaceController.updateWorkSpace)
router.delete('/', workSpaceController.deleteWorkSpace)
router.get('/',workSpaceController.getMyAllWorkSpace);
router.post('/join',requireAuth,workSpaceController.joinWorkspaceByCode)
export const workSpaceRouter= router;