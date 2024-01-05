import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import PreRotaController from '@controllers/PreRotaController';
import Autenticacao from '@middlewares/Autenticacao';
import Upload from '@middlewares/Upload';

const preRotaRouter = Router();
const preRotaController = new PreRotaController();

preRotaRouter.post(
  '/automatica',
  Autenticacao,
  celebrate({
    [Segments.BODY]: {
      path: Joi.string().required(),
      date: Joi.string()
        .regex(/^\d{2}\/\d{2}\/\d{4}$/)
        .message('Date must be in the format DD/MM/yyyy')
        .required(),
      emails: Joi.array().items(Joi.string().required()).required(),
    },
  }),
  preRotaController.rotinaAutomatica,
);

preRotaRouter.post(
  '/manual',
  Autenticacao,
  Upload.single('pre-rota'),
  preRotaController.rotinaManual,
);

export default preRotaRouter;
