import express, { NextFunction, Request, Response, response } from "express";
import cors from 'cors';
import routes from './routes/index'
import AppError from "@shared/errors/AppError";

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes)

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if(error instanceof AppError){
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message
    })
  }

  return response.status(500).json({
    status: 'error',
    message: "Internal server error"
  })
},);

app.listen(3333, () => {
  console.log("Server start on port 3333")
})
