import { Router } from "express";
import { workSpaceController } from "./workspace.controller";
import { requireAuth } from "../../middlewares";



const router = Router();



router.post('/',requireAuth, workSpaceController.createWorkSpace)

router.put('/',workSpaceController.updateWorkSpace)
router.delete('/', workSpaceController.deleteWorkSpace)

export const workSpaceRouter= router;