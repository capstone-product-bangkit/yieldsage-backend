import { ProjectEntity } from "../entities/ProjectEntity";
import { addDoc, collection, Firestore, getDoc, doc, getDocs, query, where, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import { GetProjectbyID, UploadImageProject, ProjectData, ProjectImageContent } from "../dto/ProjectDto";
import { ProjectImageContentEntity } from "../entities/ProjectImageContentEntity";


interface ProjectRepository {
  createProject(project: ProjectEntity): Promise<ProjectEntity | undefined> ;
  getProjectById(projectCred: GetProjectbyID): Promise<ProjectEntity | undefined> ;
  getProjects(user_id: string): Promise<Array<ProjectEntity> | undefined>;
  uploadImageProject(imageCred: UploadImageProject): Promise<ProjectEntity | undefined>;
}

class ProjectRepositoryImpl implements ProjectRepository {
  private db: Firestore;
  id?: string;
  total_yield?: number;
  age_average?: number;
  cpa_average?: number;
  yield_individual?: Array<number>;
  age_individual?: Array<number>;
  cpa_individual?: Array<number>;
  tree_count?: number;
  imageUrl?: string;

  constructor(database: Firestore) {
    this.db = database;
  }

  serialize(image: ProjectImageContent): any{
    return {
      id: image.id,
      total_yield: image.total_yield,
      age_average: image.age_average,
      cpa_average: image.cpa_average,
      yield_individual: image.yield_individual,
      age_individual: image.age_individual,
      cpa_individual: image.cpa_individual,
      tree_count: image.tree_count,
      imageUrl: image.imageUrl,
    };
  }

  async createProject(project: ProjectEntity): Promise<ProjectEntity | undefined> { 
    try {
      if (!project.name || !project.description) {
        return undefined;
      }

      const projectData = {
        id: project.id || uuidv4(),
        user_id: project.user_id,
        name: project.name,
        description: project.description,
        image_content: project.image_content,
      }

      const docRef = await addDoc(collection(this.db, 'projects'), projectData);

      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        return new ProjectEntity(data.id, data.user_id, data.name, data.description, data.image_content);
      }
    } catch (error: any) {
      return undefined;
    }
  }

  async getProjectById(projectCred: GetProjectbyID): Promise<ProjectEntity | undefined> {
    try {
      if (!projectCred.id || !projectCred.user_id) {
        return undefined;
      }
  
      const projectsRef = collection(this.db, 'projects');
      const queryRef = query(projectsRef, 
                             where('id', '==', projectCred.id), 
                             where('user_id', '==', projectCred.user_id));
      const querySnapshot = await getDocs(queryRef);
  
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];  // Assuming id and user_id are unique and only one document will match
        const data = doc.data();
        return new ProjectEntity(data.id, data.user_id, data.name, data.description, data.image_content);
      }
  
      return undefined;
    } catch (error: any) {
      return undefined;
    }
  }

  async getProjects(user_id: string): Promise<Array<ProjectEntity> | undefined> {
    try {
      if (!user_id) {
        return undefined;
      }
  
      const projectsRef = collection(this.db, 'projects');
      const queryRef = query(projectsRef, where('user_id', '==', user_id));
      const querySnapshot = await getDocs(queryRef);
      const projects: Array<ProjectEntity> = [];
  
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        projects.push(new ProjectEntity(data.id, data.user_id, data.name, data.description, data.image_content));
      });
  
      return projects;
    } catch (error: any) {
      return undefined;
    }
  }

  async uploadImageProject(imageCred: UploadImageProject): Promise<ProjectEntity | undefined> {
    try {
      if (!imageCred.project_id || !imageCred.user_id || !imageCred.image_url) {
        return undefined;
      }
  
      const project = await this.getProjectById(new GetProjectbyID(imageCred.project_id, imageCred.user_id));

      console.log(project!.image_content); 

      // create array of objects
      const imageContent = project!.image_content.map((image) => this.serialize(image));

      console.log(imageContent);

  
      if (!project) {
        return undefined;
      }
  
      const imageId = uuidv4();
      const projectDatas: ProjectImageContent = {
        id: imageId,
        total_yield: null,
        age_average: null,
        cpa_average: null,
        yield_individual: [],
        age_individual: [],
        cpa_individual: [],
        tree_count:  null,
        imageUrl: imageCred.image_url,
      };

      imageContent.push(this.serialize(projectDatas));
      
      const transformImageContent: ProjectImageContent[] = (imageContent as any[]).map((image) => {
        return {
          id: image.id,
          total_yield: image.total_yield,
          age_average: image.age_average,
          cpa_average: image.cpa_average,
          yield_individual: image.yield_individual,
          age_individual: image.age_individual,
          cpa_individual: image.cpa_individual,
          tree_count: image.tree_count,
          imageUrl: image.imageUrl,
        };
      });

      const projectData: ProjectData = {
        id: project.id,
        user_id: project.user_id,
        name: project.name,
        description: project.description,
        image_content: transformImageContent,
      };

      console.log(projectData);

      // Query to find the document by id and user_id
      const projectsRef = collection(this.db, 'projects');
      const queryRef = query(projectsRef, where('id', '==', project.id), where('user_id', '==', project.user_id));
      const querySnapshot = await getDocs(queryRef);
  
      if (querySnapshot.empty) {
        return undefined; // No matching document found
      }
  
      // Assuming there's only one document matching the query
      const docRef = querySnapshot.docs[0].ref;
      await setDoc(docRef, projectData, { merge: true });
      
      return projectData;
    } catch (error: any) {
      console.error("Error updating project:", error);
      return undefined;
    }
  }

}

export {
  ProjectRepository,
  ProjectRepositoryImpl
}