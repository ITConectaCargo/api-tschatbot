import express, { Router } from "express";
import WhatsappController from "@controllers/WhatsappController";


const whatsappRouter = Router();
const whatsappController = new WhatsappController()


whatsappRouter.get("/", whatsappController.validacao)
whatsappRouter.post("/", whatsappController.recebeMensagemMeta);

export default whatsappRouter;
