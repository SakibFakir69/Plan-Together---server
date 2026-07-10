import { Router } from "express";
import { workSpaceController } from "./workspace.controller";



const router = Router();



router.post('/', workSpaceController.createWorkSpace)

router.put('/',workSpaceController.updateWorkSpace)
router.delete('/', workSpaceController.deleteWorkSpace)

export const workSpaceRouter= router;