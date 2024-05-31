import express from "express";
import firebaseConn from "../config/dbConnect";
import { UserTestRepositoryImpl } from "../repositories/UserTestRepository";
import { UserTestServiceImpl } from "../services/UserTestService";
import { UserTestControllerImpl } from "../controllers/UserTestController";

const router = express.Router();
const db = firebaseConn.getFirestoreDB();

const userTestRepo: UserTestRepositoryImpl = new UserTestRepositoryImpl(db);
const userTestService: UserTestServiceImpl = new UserTestServiceImpl(userTestRepo);
const userTestController: UserTestControllerImpl = new UserTestControllerImpl(userTestService);

router.post("/create-user", userTestController.createUser.bind(userTestController));

export default router;