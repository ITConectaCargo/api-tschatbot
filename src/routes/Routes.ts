import {Router} from "express";
import whatsappRouter from "./WhatsappRoutes";
import minutaRouter from './MinutaRoutes'
import testeRouter from "./TesteRoutes";
import contatoRouter from "./ContatoRoutes";

const routes = Router()

routes.use('/api/minuta', minutaRouter)
routes.use('/api/testes', testeRouter)
routes.use('/api/contato', contatoRouter)
routes.use('/api/whatsapp', whatsappRouter)


export default routes;
