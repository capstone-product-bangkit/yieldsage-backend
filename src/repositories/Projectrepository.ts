import { ProjectEntity } from "../entities/ProjectEntity";
import { addDoc, collection, Firestore, getDoc, doc, getDocs, query, where, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import { GetProjectbyID, UploadImageProject } from "../dto/ProjectDto";
import { ProjectImageContentEntity } from "../entities/ProjectImageContentEntity";


interface ProjectRepository {
  createProject(project: ProjectEntity): Promise<ProjectEntity | undefined> ;
  getProjectById(projectCred: GetProjectbyID): Promise<ProjectEntity | undefined> ;
  getProjects(user_id: string): Promise<Array<ProjectEntity> | undefined>;
  uploadImageProject(imageCred: UploadImageProject): Promise<ProjectEntity | undefined>;
}

class ProjectRepositoryImpl implements ProjectRepository {
  private db: Firestore;

  constructor(database: Firestore) {
    this.db = database;
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
  
      if (!project) {
        return undefined;
      }
  
      project.image_content = project.image_content || [];
  
      const imageId = uuidv4();
      const projectImageEntity = new ProjectImageContentEntity(
        imageId,
        null,
        null,
        null,
        [],
        [],
        [],
        null,
        imageCred.image_url,
      );
      project.image_content.push(projectImageEntity);
  
      const projectData = {
        id: project.id,
        user_id: project.user_id,
        name: project.name,
        description: project.description,
        image_content: project.image_content,
      };
  
      const projectDocRef = doc(this.db, 'projects', project.id);
      await setDoc(projectDocRef, projectData, { merge: true });
  
      return project;
    } catch (error: any) {
      return undefined;
    }
  }

}

export {
  ProjectRepository,
  ProjectRepositoryImpl
}