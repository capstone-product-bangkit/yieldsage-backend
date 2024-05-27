import firebaseConn from "./config/dbConnect";
firebaseConn.initializeFirebaseApp();

import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import router from "./routes/Router";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());



app.get("/", (req: Request, res: Response) => {
  res.status(200).send({
    message: "Hello World!",
  });
});

app.use(router);

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is running on port ${process.env.APP_PORT}`);
});