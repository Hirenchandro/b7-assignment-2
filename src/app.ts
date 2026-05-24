import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import { Pool } from "pg";
import { initDB } from "./db";
import config from "./config";
import { authRouter } from "./modules/auth/auth.route";
import { issueRouter } from "./modules/issue/issue.route";

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Express Server",
    author: "B7-Assignment-2",
  });

  app.use("/api/auth", authRouter);
  app.use("/api/issues", issueRouter);
  // app.use("/api/issues", issueRouter);
  // app.use("/api/issues", issueRouter);
});

export default app;
