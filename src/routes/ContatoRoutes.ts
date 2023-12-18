import express, { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import ContatoController from "@controllers/ContatoController";

const contatoRouter = Router();
const contatoController = new ContatoController()

contatoRouter.post(
  "/criar",
  celebrate({
    [Segments.BODY]: {
      nome: Joi.string().required(),
      telefone: Joi.string().required(),
      telefone2: Joi.string(),
      telefone3: Joi.string(),
      cpfCnpj: Joi.string().required(),
      endereco: {
        rua: Joi.string(),
        numero: Joi.string(),
        bairro: Joi.string(),
        cidade: Joi.string(),
        estado: Joi.string(),
        cep: Joi.string(),
        complemento: Joi.string(),
      },
      admin: Joi.boolean(),
      estaAtivo:  Joi.boolean(),
    },
  }),
  contatoController.criar
);

export default contatoRouter;
