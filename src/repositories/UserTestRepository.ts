import { addDoc, collection, Firestore, DocumentReference, getDoc } from "firebase/firestore";
import UserTestEntity from "../entities/UserTestEntity";


interface UserTestRepository {
  createUser(user: UserTestEntity): Promise<UserTestEntity | undefined>;
};

class UserTestRepositoryImpl implements UserTestRepository {
  private db: Firestore;

  constructor(database: Firestore) {
    this.db = database;
  }

  async createUser(user: UserTestEntity): Promise<UserTestEntity | undefined> {
    try {
      if (!user.email || !user.password) {
        return undefined;
      }

      const userData = {
        email: user.email,
        password: user.password,
      }

      const docRef: DocumentReference = await addDoc(collection(this.db, 'users'), userData);

      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        return new UserTestEntity(data.email, data.password);
       }
    } catch (error: any) {
      return undefined;
    }
  }
}

export {
  UserTestRepositoryImpl,
  UserTestRepository,
};
