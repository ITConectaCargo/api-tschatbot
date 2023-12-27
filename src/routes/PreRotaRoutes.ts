import express, { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import PreRotaController from "@controllers/PreRotaController";
import autenticacao from '@middlewares/Autenticacao'

const preRotaRouter = Router();
const preRotaController = new PreRotaController()


preRotaRouter.post(
  "/automatica",
  autenticacao,
  celebrate({
    [Segments.BODY]: {
      path: Joi.string().required(),
      date: Joi.string().regex(/^\d{2}\/\d{2}\/\d{4}$/).message('Date must be in the format DD/MM/yyyy').required(),
      emails: Joi.array().items(Joi.string().required()).required()
    },
  }),
  preRotaController.rotinaAutomatica
);

export default preRotaRouter;
