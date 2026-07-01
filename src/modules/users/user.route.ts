import { Router } from "express";
import { userController } from "./user.controller";
import { requireAuth } from "../../middlewares";



const router= Router();

router.post('/', userController.createUser);
router.put('/',requireAuth, userController.updateUser);
router.delete('/',requireAuth,userController.deleteUser);
router.get('/',requireAuth, userController.getUser);



export const userRouter = router;