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
  image_content: Array<ProjectImageContent> | [];

  constructor(name: string, user_id: string, description: string, image_content: Array<ProjectImageContent> | []) {
    this.name = name;
    this.user_id = user_id;
    this.description = description;
    this.image_content = image_content;
  }
}


class ProjectResponse {
  id: string;
  user_id: string;
  name: string;
  description: string;
  image_content: Array<ProjectImageContent> | [];

  constructor(id: string, user_id: string, name: string, description: string, image_content: Array<ProjectImageContent> | []) {
    this.id = id;
    this.user_id = user_id;
    this.name = name;
    this.description = description;
    this.image_content = image_content;
  }
}

class GetProjectbyID {
  id: string;
  user_id: string;

  constructor(id: string, user_id: string) {
    this.id = id;
    this.user_id = user_id;
  }
}

class UploadImageProject {
  user_id: string;
  project_id: string;
  image_url: string;

  constructor(user_id: string, project_id: string, image_url: string) {
    this.user_id = user_id;
    this.project_id = project_id;
    this.image_url = image_url;
  }
}

interface ProjectData {
  id: string;
  user_id: string;
  name: string;
  description: string;
  image_content: ProjectImageContent[];
}

interface ProjectImageContent {
  id: string | null;
  total_yield: number | null;
  age_average: number | null;
  cpa_average: number | null;
  yield_individual: Array<number> | [];
  age_individual: Array<number> | [];
  cpa_individual: Array<number> | [];
  tree_count: number | null;
  imageUrl: string | null;
}

export {
  ProjectRequest,
  ProjectResponse,
  PROJECT_DTO,
  GetProjectbyID,
  UploadImageProject,
  ProjectData,
  ProjectImageContent
}