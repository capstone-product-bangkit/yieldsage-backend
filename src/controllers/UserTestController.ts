import firebaseConn from "../config/dbConnect";
import { Response, Request } from "express";
import { getFirestore, doc, setDoc, addDoc, collection, getDocs, query, Firestore } from "firebase/firestore";
import { UserTestService } from "../services/UserTestService";
import { UserTestRequest } from "../dto/UserTestDto";


interface UserTestController {
  createUser(req: Request, res: Response): Promise<Response | any>;
}

class UserTestControllerImpl implements UserTestController {
  private userTestService: UserTestService;

  constructor(userTestService: UserTestService) {
    this.userTestService = userTestService;
  }

  async createUser(req: Request, res: Response): Promise<Response | any> {
    try {
      const user = req.body;

      if (!user.email || !user.password) {
        return res.status(400).send({
          message: "Please provide an email and a password!",
        });
      }

      const userEntity = new UserTestRequest(user.email, user.password);
      const response = await this.userTestService.createUser(userEntity);

      if (response !== undefined) {
        return res.status(200).send({
          message: "User created successfully!",
          data: response,
        });
      }
      
    } catch (error: any) {
      res.status(500).send({
        message: error.message,
        data: error,
      });
    }
  }
}
  // const db = getFirestore();

// const createUser = async (req: Request, res: Response): Promise<Response | any> => { 
//   try {
//     const user = req.body;
//     console.log(user);
//     if (!user.email || !user.password) {
//       return res.status(400).send({
//         message: "Please provide an email and a password!",
//       });
//     }
//     const docRef = await addDoc(collection(db, 'users'), user)


//     return res.status(200).send({
//       message: "User created successfully!",
//       data: docRef.id,
//     });
//   } catch (error: any) {
//     res.status(500).send({
//       message: error.message,
//     });
//   }
// };

// export default {
//   createUser,
// };

  

export { UserTestController, UserTestControllerImpl };