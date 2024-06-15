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

class NDVIMappingEntitiy {
  id: string;
  user_id: string;
  red_image: string;
  nir_image: string;
  ndvi_image: string;
  average_ndvi: number;
  health_status: string;

  constructor(id: string, user_id: string, red_image: string, nir_image: string, ndvi_image: string, average_ndvi: number, health_status: string) {
    this.id = id;
    this.user_id = user_id;
    this.red_image = red_image;
    this.nir_image = nir_image;
    this.ndvi_image = ndvi_image;
    this.average_ndvi = average_ndvi;
    this.health_status = health_status;
  }
}

export {
  ProjectEntity,
  NDVIMappingEntitiy
}