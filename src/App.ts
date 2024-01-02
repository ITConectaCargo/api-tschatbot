import express, { NextFunction, Request, Response } from "express"
import 'express-async-errors';
import { errors } from 'celebrate';
import cors from 'cors'
import http from 'http';
import routes from "./routes/Routes"
import AppError from '@utils/AppError';
import db from "@configs/DbMongo"
import dotenv from 'dotenv'
import { initializeSocketServer } from "@utils/SocketServer";
dotenv.config()

db.on("error", console.log.bind(console, 'Erro de conexao')) //teste de conexao com o mongoDb
db.once("open", () => {
  console.log("Conexao MongoDb bem-sucedida")
})

const app = express();  //instância do express
app.use(express.json()) //interpretação em json
app.use(cors()) //habilita o Cors para todas as conexoes
app.use(routes)
app.use(errors());
app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    console.log(error);

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

const server = http.createServer(app);

// Inicia o servidor Socket.IO
initializeSocketServer(server);

export default app;
