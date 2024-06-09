import { Request, Response } from "express";
import { ProjectService } from "../services/ProjectService";
import { GetProjectbyID, ProjectRequest } from "../dto/ProjectDto";
import Helper from "../helpers/Helper";
import multer from "multer";
import { FirebaseStorage } from "firebase/storage";
import firebaseConn from "../config/dbConnect";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';




interface ProjectController {
  createProject(project: Request, res: Response): Promise<Response>;
  getProjectById(req: Request, res: Response): Promise<Response>;
  getProjects(req: Request, res: Response): Promise<Response>;
  uploadImageProject(req: Request, res: Response): Promise<Response>;
  predictProject(req: Request, res: Response): Promise<Response>;
}

class ProjectControllerImpl implements ProjectController {
  private projectService: ProjectService;

  constructor(projectService: ProjectService) {
    this.projectService = projectService;
  }

  async createProject(project: Request, res: Response): Promise<Response> {
    try {
      const { name, description } = project.body;

      if (!name || !description) {
        return res.status(400).send(Helper.ResponseData(400, 'Name and description are required!', null, null));
      }

      const user_id = res.locals.user.user_id;
      const project_request = new ProjectRequest(name, user_id, description, []);
      const response = await this.projectService.createProject(project_request);

      if (response !== undefined) {
        return res.status(201).send(Helper.ResponseData(201, 'Project created successfully', null, response));
      }

      return res.status(500).send(Helper.ResponseData(500, 'Failed to create project!', null, null));
    } catch (error: any) {
      return res.status(500).send(Helper.ResponseData(500, 'Failed to create project!', null, error));
    }
  }

  async getProjectById(req: Request, res: Response): Promise<Response> {
    try {
      const id: string = req.params.id as string;

      if (!id) {
        return res.status(400).send(Helper.ResponseData(400, 'Project id is required!', null, null));
      }

      const projetCred = new GetProjectbyID(id, res.locals.user.user_id);

      const response = await this.projectService.getProjectById(projetCred);

      if (response !== undefined) {
        return res.status(200).send(Helper.ResponseData(200, 'Get project success', null, response));
      }

      return res.status(404).send(Helper.ResponseData(404, 'Get project failed', null, null));
    } catch (error: any) {
      return res.status(500).send(Helper.ResponseData(500, 'Get project failed', null, error));
    }
  }

  async getProjects(req: Request, res: Response): Promise<Response> {
    try {
      const user_id: string = res.locals.user.user_id;  
      const response = await this.projectService.getProjects(user_id);

      if (response !== undefined) {
        return res.status(200).send(Helper.ResponseData(200, 'Get projects success', null, response));
      }

      return res.status(404).send(Helper.ResponseData(404, 'Get projects failed', null, null));
    } catch (error: any) {
      return res.status(500).send(Helper.ResponseData(500, 'Get projects failed', null, error));
    }
  }

  async uploadImageProject(req: Request, res: Response): Promise<Response> { 
    try {
      if (!req.file) {
        return res.status(400).send(Helper.ResponseData(400, 'No file uploaded', null, null));
      }

      const response = await this.projectService.uploadImageProject({
        project_id: req.params.id as string,
        user_id: res.locals.user.user_id,
        image: req.file
      });

      if (response !== undefined) {
        return res.status(200).send(Helper.ResponseData(200, 'Upload image project success', null, response));
      }

      return res.status(500).send(Helper.ResponseData(500, 'Upload image project failed', null, null));

    } catch (error: any) {
      return res.status(500).send(Helper.ResponseData(500, 'Upload image project failed', null, error));
    }
  }

  async predictProject(req: Request, res: Response): Promise<Response> {
    try {
      const user_id = res.locals.user.user_id;
      const id = req.params.id as string;

      const predictData = new GetProjectbyID(id, user_id);

      const response = await this.projectService.predictProject(predictData);

      if (!response) {
        return res.status(500).send(Helper.ResponseData(500, 'Predict project failed', null, null));
      }

      return res.status(200).send(Helper.ResponseData(200, 'Predict project success', null, response));

    } catch (error: any) {
      return res.status(500).send(Helper.ResponseData(500, 'Predict project failed', null, error));
    }
  }
}

export {
  ProjectController,
  ProjectControllerImpl
}

