import { Mensagem } from '@Interfaces/IMensagem';
import MensagemModel from '@models/MensagemModel';
import moment from 'moment';
import { Types } from 'mongoose';

interface MensagemParams {
  protocolo?: string;
  remetente: Types.ObjectId;
  destinatario: string;
  tipo: string;
  texto: string;
  idMensagem?: string;
  status: string;
  modelo?: string;
  parametros?: Record<string, unknown>;
  usuario?: Types.ObjectId;
}

export default class CriarMensagemService {
  public async executar({
    protocolo,
    remetente,
    destinatario,
    texto,
    idMensagem,
    status,
    tipo,
    modelo,
    parametros,
    usuario,
  }: MensagemParams): Promise<Mensagem> {
    const novaMensagem = new MensagemModel({
      protocolo,
      remetente,
      destinatario,
      texto,
      idMensagem,
      status,
      idTelefone: process.env.PHONEID!,
      timestamp: moment().unix(),
      tipo,
      modelo,
      parametros,
      usuario,
    });

    const mensagemSalva = await novaMensagem.save();
    return mensagemSalva;
  }
}
