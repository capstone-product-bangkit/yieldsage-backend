import { ProjectImageContentEntity } from "../entities/ProjectImageContentEntity";

const PROJECT_DTO = {
  MESSAGE_CREATE_PROJECT_SUCCESS: 'Project created successfully',
  MESSAGE_FAILED_CREATE_PROJECT: 'Failed to create project!',
  MESSAGE_GET_PROJECT_SUCCESS: 'Get project success',
  MESSAGE_GET_PROJECT_ERROR: 'Get project failed',
};

class ProjectRequest {
  name: string;
  user_id: string;
  description: string;
  image_content: Array<ProjectImageContentEntity> | null;

  constructor(name: string, user_id: string, description: string, image_content: Array<ProjectImageContentEntity> | null) {
    this.name = name;
    this.user_id = user_id;
    this.description = description;
    this.image_content = image_content;
  }
}


class ProjectResponse {
  id: string;
  name: string;
  description: string;
  image_content: Array<ProjectImageContentEntity> | null;

  constructor(id: string, name: string, description: string, image_content: Array<ProjectImageContentEntity> | null) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.image_content = image_content;
  }
}

export {
  ProjectRequest,
  ProjectResponse,
  PROJECT_DTO,
}