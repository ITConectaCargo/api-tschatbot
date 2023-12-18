import express, { Router } from "express";
import TestesController from "@controllers/TestesController";
import { celebrate, Joi, Segments } from "celebrate";

const testeRouter = Router();
const testeController = new TestesController()

testeRouter.get(
  "/teste1/:chaveNfe",
  celebrate({
    [Segments.PARAMS]: {
      chaveNfe: Joi.string().required(),
    },
  }),
  testeController.teste1
);

export default testeRouter;
