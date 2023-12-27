import express, { Router } from "express";
import MinutasController from "@controllers/MinutaController";
import { celebrate, Joi, Segments } from "celebrate";
import autenticacao from '@middlewares/Autenticacao'

const minutaRouter = Router();
const minutaController = new MinutasController()


export default minutaRouter;
