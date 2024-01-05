import ConsultaContatoService from '@services/contatos/ConsultaContatoService';
import TratarDadosService from '@services/uras/TratarDadosService';
import axios from 'axios';
import {
  WhatsAppBusinessAccount,
  WhatsAppBusinessChange,
  WhatsAppBusinessContact,
  WhatsAppBusinessError,
  WhatsAppBusinessMessage,
  WhatsAppBusinessStatus,
} from '@Interfaces/IWhatsapp';
import { Contato } from '@Interfaces/IContato';
import AtualizarMensagemService from '@services/mensagens/AtualizarMensagemService';

interface MensagemReceptivo {
  nome: string;
  telefone: string;
  para: string;
  status: string;
  telefoneId: string;
  mensagemId: string;
  timestamp: number;
  tipo: string;
  texto: string;
}

export default class IdentificaMensagemMetaService {
  private message: WhatsAppBusinessMessage;
  private contacts: WhatsAppBusinessContact;
  private changes: WhatsAppBusinessChange;
  private statuses: WhatsAppBusinessStatus | undefined;
  private error: WhatsAppBusinessError | undefined;

  constructor(private MensagemMeta: WhatsAppBusinessAccount) {
    const { entry } = this.MensagemMeta;

    if (
      entry?.[0]?.changes?.[0]?.value?.messages &&
      entry?.[0]?.changes?.[0]?.value?.contacts
    ) {
      const { messages, contacts, statuses } = entry[0].changes[0].value;

      this.message = messages[0];
      this.contacts = contacts[0];
      this.changes = entry[0].changes[0];
      this.statuses = statuses ? statuses[0] : undefined;
      this.error = this.statuses?.errors?.[0];
    }
  }

  public async executar() {
    try {
      if (
        this.changes.value.metadata.phone_number_id !== process.env.PHONEID!
      ) {
        this.enviaApiHomolgacao();
      }

      if (this.statuses) {
        const atualizarMensagem = new AtualizarMensagemService();
        if (this.error) {
          await atualizarMensagem.status(
            this.message.id,
            this.statuses.status,
            this.error.title,
          );
        }
        await atualizarMensagem.status(this.message.id, this.statuses.status);
      } else if (this.message && this.contacts && this.changes) {
        const contatoAdm = await new ConsultaContatoService().contatoAdm();
        const mensagemRecebida = this.montarMensagemReceptivo(contatoAdm);

        const tratarDados = new TratarDadosService();
        tratarDados.receptivo(mensagemRecebida);
      }
    } catch (error) {
      console.log(error);
    }
  }

  private montarMensagemReceptivo(contatoAdm: Contato): MensagemReceptivo {
    const tipo = this.message.type;
    const texto = this.buscaTexoBaseadoNoTipo(tipo);

    return {
      nome: this.contacts.profile.name,
      telefone: this.message.from,
      para: contatoAdm.telefone,
      status: 'receive',
      telefoneId: this.changes.value.metadata.phone_number_id,
      mensagemId: this.message.id,
      timestamp: this.message.timestamp,
      tipo,
      texto,
    };
  }

  private buscaTexoBaseadoNoTipo(type: string): string {
    switch (type) {
      case 'text':
        return this.message.text?.body || '';
      case 'button':
        return this.message.button?.text || '';
      case 'audio':
        return this.message.audio?.id || '';
      case 'interactive':
        return this.message.interactive?.button_reply?.title || '';
      default:
        return '';
    }
  }

  private async enviaApiHomolgacao() {
    console.log('testes interno');
    axios
      .post(
        'https://chatapi.wesleymoraescon.repl.co/api/whatsapp',
        this.MensagemMeta,
      )
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      .then((resposta: any) => {
        console.log('Enviado para Bot Teste');
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      .catch((erro: any) => {
        console.log('Erro ao enviar para Bot teste');
      });
  }
}
