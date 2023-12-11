import express, { Router } from "express";
import MinutasController from "@controllers/MinutaController";
import { celebrate, Joi, Segments } from "celebrate";

const minutaRouter = Router();
const minutaController = new MinutasController()

minutaRouter.post(
  "/automatica",
  celebrate({
    [Segments.BODY]: {
      path: Joi.string().required(),
      date: Joi.string().regex(/^\d{2}\/\d{2}\/\d{4}$/).message('Date must be in the format DD/MM/yyyy').required(),
      emails: Joi.array().items(Joi.string().required()).required()
    },
  }),
  minutaController.rotinaAutomatica
);

export default minutaRouter;
