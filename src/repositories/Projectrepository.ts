import { ProjectEntity } from "../entities/ProjectEntity";
import { addDoc, collection, Firestore, getDoc, doc, getDocs } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';


interface ProjectRepository {
  createProject(project: ProjectEntity): Promise<ProjectEntity | undefined>;
  getProjectById(id: string): Promise<ProjectEntity | undefined>;
  getProjects(): Promise<Array<ProjectEntity> | undefined>;
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
        return new ProjectEntity(data.user_id, data.id, data.name, data.description, data.image_content);
      }
    } catch (error: any) {
      return undefined;
    }
  }

  async getProjectById(id: string): Promise<ProjectEntity | undefined> {
    try {
      if (!id) {
        return undefined;
      }
  
      const docRef = doc(this.db, 'projects', id.toString()); // Use doc() instead of collection()
      const docSnapshot = await getDoc(docRef);
  
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        return new ProjectEntity(data.user_id, data.id, data.name, data.description, data.image_content);
      }
    } catch (error: any) {
      return undefined;
    }
  }

  async getProjects(): Promise<Array<ProjectEntity> | undefined> { 
    try {
      const querySnapshot = await getDocs(collection(this.db, 'projects'));
      const projects: Array<ProjectEntity> = [];
  
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        projects.push(new ProjectEntity(data.user_id, data.id, data.name, data.description, data.image_content));
      });
  
      return projects;
    } catch (error: any) {
      return undefined;
    }
  }

}

export {
  ProjectRepository,
  ProjectRepositoryImpl
}