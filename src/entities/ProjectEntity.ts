import { ProjectData, ProjectImageContent } from "../dto/ProjectDto";
import { ProjectImageContentEntity } from "./ProjectImageContentEntity";

class ProjectEntity {
  id: string;
  user_id: string;
  name: string;
  description: string;
  image_content: Array<ProjectImageContent> | [];
  


  constructor(id: string, user_id: string,  name: string, description: string, image_content: Array<ProjectImageContent> | []) {
    this.id = id;
    this.user_id = user_id;
    this.name = name;
    this.description = description;
    this.image_content = image_content;
  }
}

export {
    ProjectEntity
}