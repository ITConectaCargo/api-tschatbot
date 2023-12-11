import {Router} from "express";
import whatsappRouter from "./WhatsappRoutes";
import minutaRouter from './MinutaRoutes'

const routes = Router()

routes.use('/api/minuta', minutaRouter)

export default routes;
