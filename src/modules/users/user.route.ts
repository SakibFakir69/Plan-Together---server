import { Router } from "express";
import { userController } from "./user.controller";



const router= Router();

router.post('/',userController.createUser);
router.put('/', userController.updateUser);
router.delete('/',userController.deleteUser);
router.get('/', userController.getUser);