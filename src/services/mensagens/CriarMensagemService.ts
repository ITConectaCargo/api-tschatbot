import MensagemModel, { Mensagem } from "@models/MensagemModel";
import { Types } from "mongoose";

interface MensagemParams {
  protocolo: string;
  remetente: Types.ObjectId;
  destinatario: string;
  tipo: string;
  texto: string;
  idMensagem?: string;
  status: string;
  idTelefone: string;
  timestamp: number;
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
    idTelefone,
    timestamp,
    tipo,
    modelo,
    parametros,
    usuario
  }: MensagemParams): Promise<Mensagem> {

    const novaMensagem = new MensagemModel({
      protocolo,
      remetente,
      destinatario,
      texto,
      idMensagem,
      status,
      idTelefone,
      timestamp,
      tipo,
      modelo,
      parametros,
      usuario
    })

    const mensagemSalva = await novaMensagem.save()
    return mensagemSalva
  }
}
