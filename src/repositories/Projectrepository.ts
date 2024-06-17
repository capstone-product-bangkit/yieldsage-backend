import { NDVIMappingEntitiy, PredictionEntity, ProjectEntity } from "../entities/ProjectEntity";
import { addDoc, collection, Firestore, getDoc, doc, getDocs, query, where, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import { GetProjectbyID, UploadImageProject, ProjectData, ProjectImageContent, NDVIImage } from "../dto/ProjectDto";
import { ProjectImageContentEntity } from "../entities/ProjectImageContentEntity";
import axios from "axios";
import firebaseConn from "../config/dbConnect";
import { FirebaseStorage } from "firebase/storage";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import dotenv from "dotenv";
import multer from "multer";
import { YieldCalculation } from "../utils/YieldCalculation";


dotenv.config();  


interface ProjectRepository {
  createProject(project: ProjectEntity): Promise<ProjectEntity | undefined> ;
  getProjectById(projectCred: GetProjectbyID): Promise<ProjectEntity | undefined> ;
  getResultById(projectCred: GetProjectbyID): Promise<PredictionEntity | undefined> ;
  getProjects(user_id: string): Promise<Array<ProjectEntity> | undefined>;
  getResults(user_id: string): Promise<Array<PredictionEntity> | undefined>;
  uploadImageProject(imageCred: UploadImageProject): Promise<ProjectEntity | undefined>;
  predictProject(projectCred: GetProjectbyID): Promise<ProjectEntity | any | undefined>;
  calculateNDVIMappintg(ndviImage: NDVIImage): Promise<NDVIMappingEntitiy | undefined>;
  getAllNDVIMapping(user_id: string): Promise<Array<NDVIMappingEntitiy> | undefined>;
}

class ProjectRepositoryImpl implements ProjectRepository {
  private db: Firestore;
  private storageInstace: FirebaseStorage;

  constructor(database: Firestore) {
    this.db = database;
    this.storageInstace = firebaseConn.getStorageInstance();
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

  async getResultById(projectCred: GetProjectbyID): Promise<PredictionEntity | undefined> {
    try {
      if (!projectCred.id || !projectCred.user_id) {
        return undefined;
      }
  
      const projectsRef = collection(this.db, 'prediction');
      const queryRef = query(projectsRef, 
                             where('id', '==', projectCred.id), 
                             where('user_id', '==', projectCred.user_id));
      const querySnapshot = await getDocs(queryRef);
  
      let tree_count = 0;
      let age_average = 0;
      let cpa_average = 0;
      let total_yield = 0;
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];  // Assuming id and user_id are unique and only one document will match
        const data = doc.data();

        data.image_content.forEach((image: ProjectImageContentEntity) => {
          tree_count += image.tree_count!;
          age_average += image.age_average!;
          cpa_average += image.cpa_average!;
          total_yield += image.total_yield!;
        });

        age_average = age_average / data.image_content.length;
        cpa_average = cpa_average / data.image_content.length;

        return new PredictionEntity(data.id, data.user_id, data.name, data.description, data.image_content, age_average, tree_count, cpa_average, total_yield);
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

  async getResults(user_id: string): Promise<Array<PredictionEntity> | undefined> {
    try {
      if (!user_id) {
        return undefined;
      }

      console.log("Getting results...", user_id);
  
      const projectsRef = collection(this.db, 'prediction');
      const queryRef = query(projectsRef, where('user_id', '==', user_id));
      const querySnapshot = await getDocs(queryRef);
      const projects: Array<PredictionEntity> = [];
  
      let tree_count = 0;
      let age_average = 0;
      let cpa_average = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        data.image_content.forEach((image: ProjectImageContentEntity) => {
          tree_count += image.tree_count!;
          age_average += image.age_average!;
          cpa_average += image.cpa_average!;
        });

        age_average = age_average / data.image_content.length;
        cpa_average = cpa_average / data.image_content.length;

        projects.push(new PredictionEntity(data.id, data.user_id, data.name, data.description, data.image_content, age_average, tree_count, cpa_average, data.total_yield!));
      });
  
      return projects;
    } catch (error: any) {
      return undefined;
    }
  }

  async uploadImageProject(imageCred: UploadImageProject): Promise<ProjectEntity | undefined> {
    try {
      if (!imageCred.project_id || !imageCred.user_id || !imageCred.image) {
        return undefined;
      }

      const project = await this.getProjectById(new GetProjectbyID(imageCred.project_id, imageCred.user_id));

      // create array of objects
      const imageContent = project!.image_content.map((image) => this.serialize(image));
      const imageFile = imageCred.image;
      const storageRef = ref(this.storageInstace, `images/${uuidv4()}_${imageFile.originalname}`);

      await uploadBytes(storageRef, imageFile.buffer, {
        contentType: imageFile.mimetype
      });

      const publicUrl = await getDownloadURL(storageRef);

      if (!publicUrl) {
        return undefined;
      }
  
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
        imageUrl: publicUrl,
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

  async predictProject(projectCred: GetProjectbyID): Promise<ProjectEntity | any | undefined> {
    try {
      if (!projectCred.id || !projectCred.user_id) {
        return undefined;
      }
  
      const project = await this.getProjectById(projectCred);
  
      if (!project) {
        return undefined;
      }
      
      const imageContent = project.image_content;

      const imageUrls = imageContent.map((image) => image.imageUrl);

      console.log("Predicting...", process.env.FLASK_URL);

      const response = await axios.post(`${process.env.FLASK_URL}/predict`, {
        imageUrls: imageUrls
      }); 


      const datas = response.data;
      const imagesData = datas.images;
      
      let downloadsUrls: string[] = [];

      const uploadPromises = Object.entries(imagesData).map(async ([filename, base64Data]) => {
        const buffer = Buffer.from(base64Data as string, 'base64');
        const storageRef = ref(this.storageInstace, `images/${uuidv4()}_${filename}`);
        
        await uploadBytes(storageRef, buffer, {
          contentType: 'image/png'
        });

        const publicUrl = await getDownloadURL(storageRef);
        downloadsUrls.push(publicUrl);
      });

      await Promise.all(uploadPromises);


      const projectDatas: ProjectImageContent[] = imageContent.map((image, index) => {
        const yieldCalculation = new YieldCalculation(datas.predictionResults[index]);
        const treeCount = yieldCalculation.treecount();
        const total_yield = yieldCalculation.totalYield();
        const age_individual = yieldCalculation.calculateIndividualAge();
        const age_average = yieldCalculation.calculateAgeAverage(age_individual);
        const cpa_average = yieldCalculation.calculateCPAAverage();
        const yield_individual = yieldCalculation.calculateIndividialYield();

        return {
          id: uuidv4(),
          total_yield: total_yield,
          age_average: age_average,
          cpa_average: cpa_average,
          yield_individual: yield_individual,
          age_individual: age_individual,
          cpa_individual: datas.predictionResults[index],
          tree_count: treeCount,
          imageUrl: downloadsUrls[index],
        };
      });


      const predictionRef = collection(this.db, 'prediction');

      const projectData = {
        id: uuidv4(),
        user_id: project.user_id,
        name: project.name,
        description: project.description,
        image_content: projectDatas,
      }

      const docRef = await addDoc(predictionRef, projectData);

      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        return new ProjectEntity(data.id, data.user_id, data.name, data.description, data.image_content);
      }

      return undefined;
  
    } catch (error: any) {
      return undefined;
    }
  
  }

  async calculateNDVIMappintg(ndviImage: NDVIImage): Promise<NDVIMappingEntitiy | undefined> {
    try {
      if (!ndviImage.red_image || !ndviImage.nir_image) {
        return undefined;
      }

      const redImageFile = ndviImage.red_image;
      const nirImageFile = ndviImage.nir_image;
      const redStorageRef = ref(this.storageInstace, `red_images/${uuidv4()}_${redImageFile.originalname}`);
      const nirStorageRef = ref(this.storageInstace, `nir_images/${uuidv4()}_${nirImageFile.originalname}`);

      await uploadBytes(redStorageRef, redImageFile.buffer, {
        contentType: redImageFile.mimetype
      });
      
      await uploadBytes(nirStorageRef, nirImageFile.buffer, {
        contentType: nirImageFile.mimetype
      });

      const redPublicUrl = await getDownloadURL(redStorageRef);
      const nirPublicUrl = await getDownloadURL(nirStorageRef);

      if (!redPublicUrl || !nirPublicUrl) {
        return undefined;
      }

      console.log("Predicting...", process.env.FLASK_URL);

      const response = await axios.post(`${process.env.FLASK_URL}/calculate-ndvi`, {
        imageUrls: [nirPublicUrl, redPublicUrl]
      }); 

      if (!response) {
        return undefined;
      }

      const data = response.data;
      
      if(!data) {
        return undefined;
      }

      const base64Data = data.ndvi_image;
      const buffer = Buffer.from(base64Data as string, 'base64');
      const storageRef = ref(this.storageInstace, `ndvi_images/${uuidv4()}_ndvi_image.tif`);

      await uploadBytes(storageRef, buffer, {
        contentType: 'image/tiff'
      });

      const ndviPublicUrl = await getDownloadURL(storageRef);

      if (!ndviPublicUrl) {
        return undefined;
      }

      const ndviMappingData = {
        id: uuidv4(),
        user_id: ndviImage.user_id,
        red_image: redPublicUrl,
        nir_image: nirPublicUrl,
        ndvi_image: ndviPublicUrl,
        average_ndvi: data.average_ndvi,
        health_status: data.health_status,
      };  

      const docRef = await addDoc(collection(this.db, 'ndvi_mapping'), ndviMappingData);

      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        return new NDVIMappingEntitiy(data.id, data.user_id, data.red_image, data.nir_image, data.ndvi_image, data.average_ndvi, data.health_status);
      }

      return undefined;

    } catch (error: any) {
      return undefined;
    }
  }

  async getAllNDVIMapping(user_id: string): Promise<Array<NDVIMappingEntitiy> | undefined> {
    try {
      if (!user_id) {
        return undefined;
      }

      const ndviMappingRef = collection(this.db, 'ndvi_mapping');
      const queryRef = query(ndviMappingRef, where('user_id', '==', user_id));
      const querySnapshot = await getDocs(queryRef);
      const ndviMappings: Array<NDVIMappingEntitiy> = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        ndviMappings.push(new NDVIMappingEntitiy(data.id, data.user_id, data.red_image, data.nir_image, data.ndvi_image, data.average_ndvi, data.health_status));
      });

      return ndviMappings;
    } catch (error: any) {
      return undefined;
    }
  
  }

}

export {
  ProjectRepository,
  ProjectRepositoryImpl
}