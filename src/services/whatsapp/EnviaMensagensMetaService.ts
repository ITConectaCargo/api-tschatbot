import { Embarcador } from '@Interfaces/IEmbarcador';
import { Mensagem } from '@Interfaces/IMensagem';
import { Minuta } from '@Interfaces/IMinuta';
import { Protocolo } from '@Interfaces/IProtocolo';
import AtualizarMensagemService from '@services/mensagens/AtualizarMensagemService';
import axios from 'axios';
import moment from 'moment';

export default class EnviaMensagensMetaService {
  private readonly endpoint: string;
  private readonly mensagem: Mensagem;

  constructor(mensagem: Mensagem) {
    this.endpoint = `https://graph.facebook.com/v16.0/${
      mensagem.idTelefone
    }/messages?access_token=${process.env.TOKENMETA!}`;
    this.mensagem = mensagem;
  }

  public async Texto(): Promise<void> {
    try {
      const resposta = await axios.post(this.endpoint, {
        messaging_product: 'whatsapp',
        to: this.mensagem.destinatario,
        text: {
          body: this.mensagem.texto,
        },
      });
      const dados = resposta.data;
      const messageId = dados.messages[0].id;
      const atualizaStatus = new AtualizarMensagemService();
      await atualizaStatus.idMensagem(this.mensagem._id, messageId, 'sent');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const dados = error.response.data.error.message;
      console.log('Erro Mensagem normal:');
      console.log(dados);
    }
  }

  public async Opcoes(parametros: { opcoes: string[] }): Promise<void> {
    const buttons = [];

    for (let i = 0; i < parametros.opcoes.length; i++) {
      const option = parametros.opcoes[i];
      if (option) {
        buttons.push({
          type: 'reply',
          reply: {
            id: (i + 1).toString(),
            title: option,
          },
        });
      } else {
        break;
      }
    }

    const query = {
      messaging_product: 'whatsapp',
      to: this.mensagem.destinatario,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: {
          text: this.mensagem.texto,
        },
        action: {
          buttons: buttons,
        },
      },
    };

    try {
      const resposta = await axios.post(this.endpoint, query);
      const dados = resposta.data;
      const messageId = dados.messages[0].id;
      const atualizaStatus = new AtualizarMensagemService();
      await atualizaStatus.idMensagem(this.mensagem._id, messageId, 'sent');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (erro: any) {
      const dados = erro.response.data.error.message;
      console.log('Erro Mensagem opções:');
      console.log(dados);
    }
  }

  public async Lista(parametros: {
    botao: string;
    opcoes: string[];
  }): Promise<void> {
    const lista = [];

    // Verifica a existência de até 10 parâmetros e cria os botões correspondentes
    for (let i = 0; i <= parametros.opcoes.length; i++) {
      const option = parametros.opcoes[i];
      if (option) {
        lista.push({
          id: (i + 1).toString(),
          title: option,
        });
      } else {
        break;
      }
    }

    const query = {
      messaging_product: 'whatsapp',
      to: this.mensagem.destinatario,
      type: 'interactive',
      interactive: {
        type: 'list',
        body: {
          text: this.mensagem.texto,
        },
        action: {
          button: parametros.botao,
          sections: [
            {
              rows: [...lista],
            },
          ],
        },
      },
    };

    try {
      const resposta = await axios.post(this.endpoint, query);
      const dados = resposta.data;
      const messageId = dados.messages[0].id;
      const atualizaStatus = new AtualizarMensagemService();
      await atualizaStatus.idMensagem(this.mensagem._id, messageId, 'sent');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (erro: any) {
      const dados = erro.response.data.error.error_data.details;
      console.log('Erro Mensagem Lista:');
      console.log(dados);
    }
  }

  public async TemplateAgendaDevolucao(
    protocolo: Protocolo,
    minuta: Minuta,
    embarcador: Embarcador,
  ): Promise<void> {
    try {
      const resposta = await axios.post(this.endpoint, {
        messaging_product: 'whatsapp',
        to: this.mensagem.destinatario,
        type: 'template',
        template: {
          namespace: '80bb8524_4de1_4ca7_a75b_acf1eaca87f1',
          name: 'agenda_devolucao',
          language: {
            code: 'pt_BR',
          },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: protocolo.de.nome },
                { type: 'text', text: minuta.descricaoProduto },
                { type: 'text', text: embarcador.nome },
                { type: 'text', text: protocolo.de.endereco.rua },
                {
                  type: 'text',
                  text: protocolo.de.endereco.numero
                    ? protocolo.de.endereco.numero
                    : '⠀',
                },
                { type: 'text', text: protocolo.de.endereco.bairro },
                { type: 'text', text: protocolo.de.endereco.cidade },
                { type: 'text', text: protocolo.de.endereco.estado },
                { type: 'text', text: protocolo.de.endereco.cep },
                {
                  type: 'text',
                  text: minuta.checklist?.motivo
                    ? minuta.checklist.motivo
                    : '⠀',
                },
                {
                  type: 'text',
                  text: minuta.checklist?.detalhes
                    ? minuta.checklist.detalhes
                    : '⠀',
                },
                {
                  type: 'text',
                  text: `*${moment(minuta.dataAgendamento).format(
                    'DD/MM/yyyy',
                  )}*`,
                },
              ],
            },
          ],
        },
      });
      const dados = resposta.data;
      const messageId = dados.messages[0].id;
      const atualizaStatus = new AtualizarMensagemService();
      await atualizaStatus.idMensagem(this.mensagem._id, messageId, 'sent');
      console.log(`Mensagem Template enviada para: ${protocolo.de.nome}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (erro: any) {
      const dados = erro.response?.data?.error?.message;
      console.log('Erro ao Enviar Template META');
      console.log(dados);
    }
  }

  public async TemplateSensiveis() // mensagem: Mensagem
  : Promise<void> {}

  public async imagem() {
    try {
      const resposta = await axios.post(this.endpoint, {
        messaging_product: 'whatsapp',
        to: this.mensagem.destinatario,
        type: 'image',
        image: {
          link: `https://chatbot.devinectar.com.br/conversas/imagens/${this.mensagem.texto}.jpg`,
        },
      });
      const dados = resposta.data;
      const messageId = dados.messages[0].id;
      const atualizaStatus = new AtualizarMensagemService();
      await atualizaStatus.idMensagem(this.mensagem._id, messageId, 'sent');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const dados = error.response.data.error.message;
      console.log('Erro Mensagem normal:');
      console.log(dados);
    }
  }

  public async documento() {
    try {
      const resposta = await axios.post(this.endpoint, {
        messaging_product: 'whatsapp',
        to: this.mensagem.destinatario,
        type: 'document',
        document: {
          link: `https://chatbot.devinectar.com.br/conversas/arquivos/${this.mensagem.texto}`,
        },
      });
      const dados = resposta.data;
      const messageId = dados.messages[0].id;
      const atualizaStatus = new AtualizarMensagemService();
      await atualizaStatus.idMensagem(this.mensagem._id, messageId, 'sent');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const dados = error.response.data.error.message;
      console.log('Erro Mensagem normal:');
      console.log(dados);
    }
  }
}
