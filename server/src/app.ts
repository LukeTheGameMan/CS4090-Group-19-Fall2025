import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';

import authRouter from './api/v1/auth/_routes';
import userRouter from './api/v1/user/_routes';
import postRouter from './api/v1/post/_routes';

// create express app
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // parse data from html <form> submissions 
app.use(express.static(path.join(__dirname, "../../web_dir"))); // know where to serve the .html files from

// register routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);

export default app;