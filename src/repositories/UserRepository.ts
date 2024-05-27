import { addDoc, collection, Firestore, DocumentReference, getDoc } from "firebase/firestore";
import UserEntity from "../entities/UserEntity";


interface UserRepository {
  createUser(user: UserEntity): Promise<UserEntity | undefined>;
};

class UserRepositoryImpl implements UserRepository {
  private db: Firestore;

  constructor(database: Firestore) {
    this.db = database;
  }

  async createUser(user: UserEntity): Promise<UserEntity | undefined> {
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
        return new UserEntity(data.email, data.password);
       }
    } catch (error: any) {
      return undefined;
    }
  }
}

export {
  UserRepositoryImpl,
  UserRepository,
};
