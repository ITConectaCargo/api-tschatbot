import express, { Router } from "express";
import WhatsappController from "../controllers/WhatsappController";

const router = Router();

router
  .get("/whatsapp", WhatsappController.validacao)
  .post("/whatsapp", WhatsappController.recebeMensagemMeta);

export default router;
