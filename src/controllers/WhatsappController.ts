import { Request, Response } from "express";
import dotenv from 'dotenv'
import axios from "axios";
import ConsultaContatoService from "@services/contatos/ConsultaContatoService";
import TratarDadosService from "@services/uras/TratarDadosService";

export default class WhatsappController {
  public async validacao(req: Request, res: Response): Promise<void> {
    const mode = req.query["hub.mode"];
    const challenge = req.query["hub.challenge"];
    const token = req.query["hub.verify_token"];

    if (mode && token) {
      if (mode === "subscribe" && token === process.env.TOKENMETA!) {
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
    const objetoMeta: any = req.body;
    const mensagemMeta = objetoMeta.object ? objetoMeta.entry[0].changes[0].value : null;

      if (mensagemMeta.metadata.phone_number_id !== process.env.PHONEID!) {
        console.log("testes interno");
        axios.post('https://chatapi.wesleymoraescon.repl.co/api/whatsapp', objetoMeta)
          .then(resposta => {
            console.log("Enviado para Bot Teste");
          })
          .catch(erro => {
            console.log("Erro ao enviar para Bot teste");
          });
        res.sendStatus(200);
        return;
      }

      let texto: string = '',
        mensagemId: string = '',
        status: string = '',
        tipo: string = '';


      if (mensagemMeta.hasOwnProperty("statuses")) {
        // mensagemId = mensagemMeta.statuses[0].id;
        // status = mensagemMeta.statuses[0].status;
        // const errors = mensagemMeta.statuses[0].errors || [];
        // if (status === 'failed') {
        //   console.log('falha ao enviar mensagem META');
        //   console.log(mensagemMeta);
        //   console.log(mensagemMeta.statuses[0].errors);
        // }
        // await Mensagem.atualizaStatusMensagem(mensagemId, status, errors);
        res.sendStatus(200);


      } else if (mensagemMeta) {
        let telefone = String(mensagemMeta.messages[0].from);
        if (telefone.length < 13) {
          const telPt1 = telefone.substring(0, 4);
          const telPt2 = telefone.substring(4, 12);
          telefone = telPt1 + "9" + telPt2;
        }

        const dadosComuns = {
          nome: String(mensagemMeta.contacts[0].profile.name),
          telefone: String(telefone),
          mensagemId: String(mensagemMeta.messages[0].id),
          status: String('delivered'),
          telefoneId: String(mensagemMeta.metadata.phone_number_id),
          timestamp: Number(mensagemMeta.messages[0].timestamp)
        }


        if (mensagemMeta.messages[0].hasOwnProperty("interactive")) {
          texto = mensagemMeta.messages[0].interactive?.button_reply?.title || mensagemMeta.messages[0].interactive?.list_reply?.title;
        } else if (mensagemMeta.messages[0].hasOwnProperty("button")) {
          texto = mensagemMeta.messages[0].button.text;
        } else if (mensagemMeta.messages[0].hasOwnProperty("type")) {
          tipo = mensagemMeta.messages[0].type;
          if (tipo === 'text') {
            texto = mensagemMeta.messages[0].text.body;
          } else if (tipo === 'image') {
            texto = mensagemMeta.messages[0].image.id;
          }
        }

        const consultaContato = new ConsultaContatoService()
        const contatoAdm = await consultaContato.contatoAdm()

        const mensagem = {
          ...dadosComuns,
          para: contatoAdm.telefone,
          texto,
          tipo,
        };

        if (tipo === 'image') {
          // await this.baixaImagem(mensagem);
        }

        console.log(mensagem.nome);
        const tratarDados = new TratarDadosService()
        await tratarDados.receptivo(mensagem)

        res.sendStatus(200);
      } else {
        res.sendStatus(200);
      }
    } catch (error) {
      console.error(error);
      console.log('Mensagem recebida com erro');
      res.sendStatus(200);
    }
  }
}
