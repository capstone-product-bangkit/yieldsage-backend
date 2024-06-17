import { Request, Response } from "express";
import { ProjectService } from "../services/ProjectService";
import { GetProjectbyID, NDVIImage, ProjectRequest } from "../dto/ProjectDto";
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
  getResults(req: Request, res: Response): Promise<Response>;
  getResultById(req: Request, res: Response): Promise<Response>;
  uploadImageProject(req: Request, res: Response): Promise<Response>;
  predictProject(req: Request, res: Response): Promise<Response>;
  calculateNDVIMapping(req: Request, res: Response): Promise<Response>;
  getAllNDVIMapping(req: Request, res: Response): Promise<Response>;
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
        return res.status(400).send(Helper.ResponseData(400, 'Name and description are required!', true, null));
      }

      const user_id = res.locals.user.user_id;
      const project_request = new ProjectRequest(name, user_id, description, []);
      const response = await this.projectService.createProject(project_request);

      if (response !== undefined) {
        return res.status(201).send(Helper.ResponseData(201, 'Project created successfully', false, response));
      }

      return res.status(500).send(Helper.ResponseData(500, 'Failed to create project!', true, null));
    } catch (error: any) {
      return res.status(500).send(Helper.ResponseData(500, 'Failed to create project!', true, error));
    }
  }

  async getProjectById(req: Request, res: Response): Promise<Response> {
    try {
      const id: string = req.params.id as string;

      if (!id) {
        return res.status(400).send(Helper.ResponseData(400, 'Project id is required!', true, null));
      }

      const projetCred = new GetProjectbyID(id, res.locals.user.user_id);

      const response = await this.projectService.getProjectById(projetCred);

      if (response !== undefined) {
        return res.status(200).send(Helper.ResponseData(200, 'Get project success', false, response));
      }

      return res.status(404).send(Helper.ResponseData(404, 'Get project failed', true, null));
    } catch (error: any) {
      return res.status(500).send(Helper.ResponseData(500, 'Get project failed', true, error));
    }
  }

  async getResultById(req: Request, res: Response): Promise<Response> {
    try {
      const id: string = req.params.id as string;

      if (!id) {
        return res.status(400).send(Helper.ResponseData(400, 'Result id is required!', true, null));
      }

      const projetCred = new GetProjectbyID(id, res.locals.user.user_id);

      const response = await this.projectService.getResultById(projetCred);


      if (response !== undefined) {
        return res.status(200).send(Helper.ResponseData(200, 'Get result success', false, response));
      }

      return res.status(404).send(Helper.ResponseData(404, 'Get result failed', true, null));
    } catch (error: any) {
      return res.status(500).send(Helper.ResponseData(500, 'Get result failed', true, error));
    }
  }

  async getProjects(req: Request, res: Response): Promise<Response> {
    try {
      const user_id: string = res.locals.user.user_id;  
      const response = await this.projectService.getProjects(user_id);

      if (response !== undefined) {
        return res.status(200).send(Helper.ResponseData(200, 'Get projects success', false, response));
      }

      return res.status(404).send(Helper.ResponseData(404, 'Get projects failed', true, null));
    } catch (error: any) {
      return res.status(500).send(Helper.ResponseData(500, 'Get projects failed', true, error));
    }
  }

  async getResults(req: Request, res: Response): Promise<Response> {
    try {
      const user_id: string = res.locals.user.user_id;
      const response = await this.projectService.getResults(user_id);


      if (response !== undefined) {
        return res.status(200).send(Helper.ResponseData(200, 'Get results success', false, response));
      }

      return res.status(404).send(Helper.ResponseData(404, 'Get results failed', true, null));


    } catch(error: any) {
      return res.status(500).send(Helper.ResponseData(500, 'Get results failed', true, error));
    }
  }

  async uploadImageProject(req: Request, res: Response): Promise<Response> { 
    try {
      if (!req.file) {
        return res.status(400).send(Helper.ResponseData(400, 'No file uploaded', true, null));
      }

      const response = await this.projectService.uploadImageProject({
        project_id: req.params.id as string,
        user_id: res.locals.user.user_id,
        image: req.file
      });

      if (response !== undefined) {
        return res.status(200).send(Helper.ResponseData(200, 'Upload image project success', false, response));
      }

      return res.status(500).send(Helper.ResponseData(500, 'Upload image project failed', true, null));

    } catch (error: any) {
      return res.status(500).send(Helper.ResponseData(500, 'Upload image project failed', true, error));
    }
  }

  async predictProject(req: Request, res: Response): Promise<Response> {
    try {
      const user_id = res.locals.user.user_id;
      const id = req.params.id as string;

      const predictData = new GetProjectbyID(id, user_id);

      const response = await this.projectService.predictProject(predictData);

      if (!response) {
        return res.status(500).send(Helper.ResponseData(500, 'Predict project failed', true, null));
      }

      return res.status(200).send(Helper.ResponseData(200, 'Predict project success', false, response));

    } catch (error: any) {
      return res.status(500).send(Helper.ResponseData(500, 'Predict project failed', true, error));
    }
  }  

  async calculateNDVIMapping(req: Request, res: Response): Promise<Response> {
    try {
      if (req.files?.length !== 2) { 
        return res.status(400).send(Helper.ResponseData(400, 'Please upload 2 images', true, null));
      }
      const files = req.files as Express.Multer.File[];
      const user_id = res.locals.user.user_id;
      const red_image = files[0];
      const nir_image = files[1];

      const ndviData = new NDVIImage(user_id, red_image, nir_image);

      const response = await this.projectService.calculateNDVIMapping(ndviData);

      if (!response) {
        return res.status(500).send(Helper.ResponseData(500, 'Calculate NDVI Mapping failed', true, null));
      }

      return res.status(200).send(Helper.ResponseData(200, 'Calculate NDVI Mapping success', false, response));

    } catch (error: any) {
      return res.status(500).send(Helper.ResponseData(500, 'Calculate NDVI Mapping failed', true, error));
    }
  
  }

  async getAllNDVIMapping(req: Request, res: Response): Promise<Response> {
    try {
      const user_id = res.locals.user.user_id;
      const response = await this.projectService.getAllNDVIMapping(user_id);

      if (!response) {
        return res.status(500).send(Helper.ResponseData(500, 'Get all NDVI Mapping failed', true, null));
      }

      return res.status(200).send(Helper.ResponseData(200, 'Get all NDVI Mapping success', false, response));

    } catch (error: any) {
      return res.status(500).send(Helper.ResponseData(500, 'Get all NDVI Mapping failed', true, error));
    }
  
  }
}

export {
  ProjectController,
  ProjectControllerImpl
}

