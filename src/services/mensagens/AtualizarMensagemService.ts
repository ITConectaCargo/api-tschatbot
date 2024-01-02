import MensagemModel, { Mensagem } from "@models/MensagemModel";
import AppError from "@utils/AppError";
import { Types } from "mongoose";

export default class AtualizarMensagemService {
  public async status(mensagemId: Types.ObjectId, status: string): Promise<Mensagem> {
    const mensagem = await MensagemModel.findById(mensagemId)

    if (!mensagem) {
      throw new AppError('Mensagem nao encontrada')
    }

    if (status === 'sent' && mensagem.status !== 'pendent') {
      throw new AppError('Status antigo')
    }

    if (status === 'delivered' && mensagem.status !== 'pendent' && mensagem.status !== 'sent') {
      throw new AppError('Status antigo')
    }


    const mensagemAtualizada = await MensagemModel.findByIdAndUpdate(
      mensagemId,
      {
        status: status
      },
      { new: true }
    )

    if (!mensagemAtualizada) throw new AppError('Mensagem nao encontrada')
    return mensagemAtualizada
  }

  public async idMensagem(mensagemId: Types.ObjectId, idMensagem: string): Promise<Mensagem> {
    const mensagemAtualizada = await MensagemModel.findByIdAndUpdate(
      mensagemId,
      {
        idMensagem: idMensagem,
      },
      { new: true }
    )

    if (!mensagemAtualizada) throw new AppError('Mensagem nao encontrada')
    return mensagemAtualizada
  }
}
