import express from "express";
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

const router = express.Router();
const db = firebaseConn.getFirestoreDB();

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
router.post("/projects", AuthenticateJwt, projectController.createProject.bind(projectController));
router.get("/projects/:id", AuthenticateJwt, projectController.getProjectById.bind(projectController));
router.get("/projects", AuthenticateJwt, projectController.getProjects.bind(projectController));

export default router;