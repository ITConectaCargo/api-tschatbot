import { Router } from "express";
import whatsappRouter from "./WhatsappRoutes";
import minutaRouter from './MinutaRoutes'
import testeRouter from "./TesteRoutes";
import contatoRouter from "./ContatoRoutes";
import preRotaRouter from "./PreRotaRoutes";
import usuarioRouter from "./UsuarioRoutes";

const routes = Router()

routes.use('/api/minuta', minutaRouter)
routes.use('/api/testes', testeRouter)
routes.use('/api/contato', contatoRouter)
routes.use('/api/whatsapp', whatsappRouter)
routes.use('/api/prerota', preRotaRouter)
routes.use('/api/usuario', usuarioRouter)

export default routes;
