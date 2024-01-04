/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { WhatsAppBusinessAccount } from '@Interfaces/IWhatsapp';
import IdentificaMensagemMetaService from '@services/whatsapp/IdentificaMensagemMetaService';

export default class WhatsappController {
  public async validacao(req: Request, res: Response): Promise<void> {
    const mode = req.query['hub.mode'];
    const challenge = req.query['hub.challenge'];
    const token = req.query['hub.verify_token'];

    if (mode && token) {
      if (mode === 'subscribe' && token === process.env.TOKENMETA!) {
        res.status(200).send(challenge);
      } else {
        res.status(403).send('Acesso negado');
      }
    } else {
      res.status(400).send('Parâmetros ausentes');
    }
  }

  public async recebeMensagemMeta(req: Request, res: Response): Promise<void> {
    try {
      const objetoMeta: WhatsAppBusinessAccount = req.body;

      const identificaMensagemMeta = new IdentificaMensagemMetaService(
        objetoMeta,
      );
      await identificaMensagemMeta.executar();
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      console.log('Mensagem recebida com erro');
      res.sendStatus(200);
    }
  }
}
