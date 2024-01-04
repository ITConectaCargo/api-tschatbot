import moment from 'moment';
import ConsultaMensagemService from './ConsultaMensagemService';

export default class TranscricaoConversaService {
  private protocolo: string;

  constructor(protocolo: string) {
    this.protocolo = protocolo;
  }

  public async porTexto(): Promise<string> {
    const consultaMensagem = new ConsultaMensagemService();
    const mensagens = await consultaMensagem.porProtocolo(this.protocolo);

    let conversaCompleta = '';

    for (const mensagem of mensagens) {
      if ('nome' in mensagem.remetente && mensagem.remetente.nome) {
        const texto: string =
          `De: ${mensagem.remetente.nome}\n` +
          `Mensagem: ${mensagem.texto}\n` +
          `Hora: ${moment(mensagem.criadoEm).format('DD/MM/yyyy - HH:mm')}\n\n`;
        conversaCompleta += texto;
      }
    }

    return conversaCompleta;
  }
}
