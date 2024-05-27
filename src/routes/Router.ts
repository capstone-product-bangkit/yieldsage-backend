import express from "express";
import firebaseConn from "../config/dbConnect";
import { UserRepositoryImpl } from "../repositories/UserRepository";
import { UserServiceImpl } from "../services/UserService";
import { UserControllerImpl } from "../controllers/UserController";

const router = express.Router();
const db = firebaseConn.getFirestoreDB();

const userRepo: UserRepositoryImpl = new UserRepositoryImpl(db);
const userService: UserServiceImpl = new UserServiceImpl(userRepo);
const userController: UserControllerImpl = new UserControllerImpl(userService);

router.post("/create-user", userController.createUser.bind(userController));

export default router;