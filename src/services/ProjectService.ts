import { GetProjectbyID, NDVIImage, NDVIMappingResponse, PredictionResponse, ProjectRequest, ProjectResponse, UploadImageProject } from "../dto/ProjectDto";
import { ProjectEntity } from "../entities/ProjectEntity";
import { ProjectRepository } from "../repositories/Projectrepository";
import { v4 as uuidv4 } from 'uuid';


interface ProjectService { 
  createProject(project: ProjectRequest): Promise<ProjectResponse | undefined>;
  getProjectById(projectCred: GetProjectbyID): Promise<ProjectResponse | undefined>;
  getResultById(projectCred: GetProjectbyID): Promise<ProjectResponse | undefined>;
  getProjects(user_id: string): Promise<Array<ProjectResponse> | undefined>;
  getResults(user_id: string): Promise<Array<ProjectResponse> | undefined>;
  uploadImageProject(imageCred: UploadImageProject): Promise<ProjectResponse | undefined>;
  predictProject(projectCred: GetProjectbyID): Promise<ProjectResponse | any | undefined>;
  calculateNDVIMapping(ndviImage: NDVIImage): Promise<NDVIMappingResponse | any | undefined>;
  getAllNDVIMapping(user_id: string): Promise<Array<NDVIMappingResponse> | undefined>;
}

class ProjectServiceImpl implements ProjectService{
  private projectRepository: ProjectRepository;

  constructor(projectRepository: ProjectRepository) { 
    this.projectRepository = projectRepository;
  }

  async createProject(project: ProjectRequest): Promise<ProjectResponse | undefined> { 
    const project_id: string = uuidv4();

    const projectEntity: ProjectEntity = new ProjectEntity(project_id, project.user_id, project.name, project.description, project.image_content);
    const createdProject = await this.projectRepository.createProject(projectEntity);
    if (createdProject) {
      return new ProjectResponse(createdProject.id, createdProject.user_id, createdProject.name, createdProject.description, createdProject.image_content);
    }
    return undefined;
  }

  async getProjectById(projectCred: GetProjectbyID): Promise<ProjectResponse | undefined> { 
    const project = await this.projectRepository.getProjectById(projectCred);
    if (project) {
      return new ProjectResponse(project.id, project.user_id, project.name, project.description, project.image_content);
    }
    return undefined;
  }

  async getResultById(projectCred: GetProjectbyID): Promise<ProjectResponse | undefined> {
    const project = await this.projectRepository.getResultById(projectCred);
    if (project) {
      return new PredictionResponse(project.id, project.user_id, project.name, project.description, project.image_content, project.age_average, project.tree_count, project.cpa_average, project.total_yield);
    }
    return undefined;
  }

  async getProjects(user_id: string): Promise<Array<ProjectResponse> | undefined> { 
    const projects = await this.projectRepository.getProjects(user_id);
    if (projects) {
      return projects.map(project => new ProjectResponse(project.id, project.user_id, project.name, project.description, project.image_content));
    }
    return undefined;
  }

  async getResults(user_id: string): Promise<Array<ProjectResponse> | undefined> {
    const projects = await this.projectRepository.getResults(user_id);
    if (projects) {
      return projects.map(project => new PredictionResponse(project.id, project.user_id, project.name, project.description, project.image_content, project.age_average, project.tree_count, project.cpa_average, project.total_yield));
    }
    return undefined;
  }

  async uploadImageProject(imageCred: UploadImageProject): Promise<ProjectResponse | undefined> { 
    const project = await this.projectRepository.uploadImageProject(imageCred);
    if (project) {
      return new ProjectResponse(project.id, project.user_id, project.name, project.description, project.image_content);
    }
    return undefined;
  }

  async predictProject(projectCred: GetProjectbyID): Promise<ProjectResponse | any | undefined>{
    try {
      const project = await this.projectRepository.predictProject(projectCred);
      if (!project) {
        return undefined;
      }

      // return new ProjectResponse(project.id, project.user_id, project.name, project.description, project.image_content);
      return project;
    } catch (error: any) {
      return undefined;
    }
  }

  async calculateNDVIMapping(ndviImage: NDVIImage): Promise<NDVIMappingResponse | any | undefined> {
    try {
      const ndviMapping = await this.projectRepository.calculateNDVIMappintg(ndviImage);
      if (!ndviMapping) {
        return undefined;
      }
      return ndviMapping;
    } catch (error: any) {
      return undefined;
    }
  }

  async getAllNDVIMapping(user_id: string): Promise<Array<NDVIMappingResponse> | undefined> {
    const ndviMapping = await this.projectRepository.getAllNDVIMapping(user_id);
    if (ndviMapping) {
      return ndviMapping.map(ndvi => new NDVIMappingResponse(ndvi.id, ndvi.user_id, ndvi.red_image, ndvi.nir_image, ndvi.ndvi_image, ndvi.average_ndvi, ndvi.health_status));
    }
    return undefined;
  }
}

export {
  ProjectService,
  ProjectServiceImpl
}