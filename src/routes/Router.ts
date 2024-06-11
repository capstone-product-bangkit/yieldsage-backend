import express from "express";
import multer from 'multer';
import firebaseConn from "../config/dbConnect";
import { UserTestRepositoryImpl } from "../repositories/UserTestRepository";
import { UserTestServiceImpl } from "../services/UserTestService";
import { UserTestControllerImpl } from "../controllers/UserTestController";
import { AuthController, AuthControllerImpl } from "../controllers/AuthController";
import { UserRepository, UserRepositoryImpl } from "../repositories/UserRepository";
import { UserService, UserServiceImpl } from "../services/UserService";
import { UserController, UserControllerImpl } from "../controllers/UserController";
import { AuthenticateJwt } from "../middlewares/Authorization";
import { ProjectRepository, ProjectRepositoryImpl } from "../repositories/Projectrepository";
import { ProjectService, ProjectServiceImpl } from "../services/ProjectService";
import { ProjectController, ProjectControllerImpl } from "../controllers/ProjectController";
import { Request, Response } from "express";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';


const router = express.Router();
const db = firebaseConn.getFirestoreDB();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const userTestRepo: UserTestRepositoryImpl = new UserTestRepositoryImpl(db);
const userTestService: UserTestServiceImpl = new UserTestServiceImpl(userTestRepo);
const userTestController: UserTestControllerImpl = new UserTestControllerImpl(userTestService);

const userRepo: UserRepository = new UserRepositoryImpl();
const userService: UserService = new UserServiceImpl(userRepo);
const authController: AuthController = new AuthControllerImpl(userService);
const userController: UserController = new UserControllerImpl(userService);

const projectRepo: ProjectRepository = new ProjectRepositoryImpl(db);
const projectService: ProjectService = new ProjectServiceImpl(projectRepo);
const projectController: ProjectController = new ProjectControllerImpl(projectService);


// authentication
router.post("/create-user", userTestController.createUser.bind(userTestController));
router.get("/auth/google", authController.googleAuth.bind(authController));
router.get("/auth/google/callback", authController.googleLogin.bind(authController));

router.post("/register", userController.register.bind(userController));
router.post("/login", userController.login.bind(userController));
router.get("/me", AuthenticateJwt, userController.getMe.bind(userController));

// projects
router.get('/projects/result', AuthenticateJwt, projectController.getResults.bind(projectController));
router.get('/projects/result/:id', AuthenticateJwt, projectController.getResultById.bind(projectController));
router.post("/projects", AuthenticateJwt, projectController.createProject.bind(projectController));
router.get("/projects/:id", AuthenticateJwt, projectController.getProjectById.bind(projectController));
router.get("/projects", AuthenticateJwt, projectController.getProjects.bind(projectController));
router.post('/projects/upload/:id', AuthenticateJwt, upload.single('image'), projectController.uploadImageProject.bind(projectController));
router.post('/projects/predict/:id', AuthenticateJwt, projectController.predictProject.bind(projectController));

// route exception for all method for route not found
router.all("*", (req: Request, res: Response) => {
  return res.status(404).send("Route not found");
});

export default router;