import express, { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import UsuarioController from "@controllers/UsuarioController";
import autenticacao from '@middlewares/Autenticacao'

const usuarioRouter = Router();
const usuarioController = new UsuarioController()

usuarioRouter.post(
  "/criar",
  autenticacao,
  celebrate({
    [Segments.BODY]: {
      nome: Joi.string().required(),
      email: Joi.string().required(),
      senha: Joi.string().required(),
      confirmaSenha: Joi.string().required(),
      acesso: Joi.string().required(),
      departamento: Joi.string(),
    },
  }),
  usuarioController.criar
);

usuarioRouter.post(
  "/login",
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().required(),
      senha: Joi.string().required(),
    },
  }),
  usuarioController.logar
);

usuarioRouter.get(
  "/:id",
  autenticacao,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  usuarioController.consulta
);

export default usuarioRouter;
