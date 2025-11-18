import express from 'express';
import cookieParser from 'cookie-parser';

import authRouter from './api/v1/auth/_routes';
import userRouter from './api/v1/user/_routes';

// create express app
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // parse data from html <form> submissions 

// register routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

export default app;