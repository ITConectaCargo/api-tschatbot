import { Request, Response } from "express";
import dotenv from 'dotenv'

dotenv.config()

class WhatsappController {
  public validacao(req: Request, res: Response): void {
    // Faz a validação com a API do WhatsApp
    const mode = req.query["hub.mode"];
    const challenge = req.query["hub.challenge"];
    const token = req.query["hub.verify_token"];

    if (mode && token) {
      if (mode === "subscribe" && token === process.env.TOKENMETA) {
        res.status(200).send(challenge);
      } else {
        res.status(403).send('Acesso negado');
      }
    } else {
      res.status(400).send('Parâmetros ausentes');
    }
  }

  public recebeMensagemMeta = async (req: Request, res: Response): Promise<void> => {
    const objetoMeta = req.body;
    const mensagemMeta = objetoMeta.object ? objetoMeta.entry[0].changes[0].value : null;

    if (mensagemMeta.metadata.phone_number_id !== process.env.PHONEID) {
      res.sendStatus(200);
      return console.log('teste interno')
    }

    res.sendStatus(200);
  }
}

export default WhatsappController
