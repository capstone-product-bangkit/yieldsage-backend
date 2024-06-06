import { ProjectRequest, ProjectResponse } from "../dto/ProjectDto";
import { ProjectEntity } from "../entities/ProjectEntity";
import { ProjectRepository } from "../repositories/Projectrepository";
import { v4 as uuidv4 } from 'uuid';


interface ProjectService { 
  createProject(project: ProjectRequest): Promise<ProjectResponse | undefined>;
  getProjectById(id: string): Promise<ProjectResponse | undefined>;
  getProjects(): Promise<Array<ProjectResponse> | undefined>;
}

class ProjectServiceImpl implements ProjectService{
  private projectRepository: ProjectRepository;

  constructor(projectRepository: ProjectRepository) { 
    this.projectRepository = projectRepository;
  }

  async createProject(project: ProjectRequest): Promise<ProjectResponse | undefined> { 
    const project_id: string = uuidv4();

    const projectEntity: ProjectEntity = new ProjectEntity(project.user_id, project_id, project.name, project.description, project.image_content);
    const createdProject = await this.projectRepository.createProject(projectEntity);
    if (createdProject) {
      return new ProjectResponse(createdProject.id, createdProject.name, createdProject.description, createdProject.image_content);
    }
    return undefined;
  }

  async getProjectById(id: string): Promise<ProjectResponse | undefined> { 
    const project = await this.projectRepository.getProjectById(id);
    if (project) {
      return new ProjectResponse(project.id, project.name, project.description, project.image_content);
    }
    return undefined;
  }

  async getProjects(): Promise<Array<ProjectResponse> | undefined> { 
    const projects = await this.projectRepository.getProjects();
    if (projects) {
      return projects.map(project => new ProjectResponse(project.id, project.name, project.description, project.image_content));
    }
    return undefined;
  }
}

export {
  ProjectService,
  ProjectServiceImpl
}