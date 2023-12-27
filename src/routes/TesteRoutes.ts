import express, { Router } from "express";
import TestesController from "@controllers/TestesController";
import { celebrate, Joi, Segments } from "celebrate";
import autenticacao from '@middlewares/Autenticacao'

const testeRouter = Router();
const testeController = new TestesController()

testeRouter.post(
  "/teste1",
  celebrate({
    [Segments.BODY]: {
      chaveNfe: Joi.array().required()
    },
  }),
  testeController.teste1
);

testeRouter.get(
  "/teste2",
  testeController.teste2
);

export default testeRouter;
