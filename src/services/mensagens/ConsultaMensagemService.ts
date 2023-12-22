import MensagemModel, { Mensagem } from "@models/MensagemModel";
import AppError from "@utils/AppError";
import { Types } from "mongoose";

export default class ConsultaMensagemService {
  public async porIdcontato(id: Types.ObjectId): Promise<Mensagem> {
    const mensagem = await MensagemModel.findOne({ remetente: id }).sort({ criadoEm: -1 }).populate('remetente')

    if (!mensagem) throw new AppError('Ultima Mensagem nao encontrada')
    return mensagem
  }

  public async porProtocolo(protocolo: string): Promise<Mensagem[]> {
    const mensagens = await MensagemModel.find({protocolo: protocolo}).populate('remetente').exec()

    return mensagens
  }
}
