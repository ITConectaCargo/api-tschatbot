import MinutaModel, { Minuta } from "@models/MinutaModel";
import AppError from "@utils/AppError";
import moment, { Moment } from "moment";
import { Types } from "mongoose";


interface MinutaParams {
  _id: Types.ObjectId,
  descricaoProduto?: string,
  dataAgendamento?: Moment,

  agendado?: boolean,
  agendadoPor?: string
}

export default class AtualizarMinutaService {
  public async porId({
    _id,
    descricaoProduto,
    dataAgendamento,
    agendado,
    agendadoPor,
  }: MinutaParams): Promise<Minuta> {
    const minutaAtualizada = await MinutaModel.findByIdAndUpdate(
      _id,
      {
        descricaoProduto,
        dataAgendamento,
        agendado,
        agendadoPor,
        atualizadoEm: moment()
      },
      { new: true }
    )

    if(!minutaAtualizada) {
      throw new AppError('Minuta não encontrada')
    }

    return minutaAtualizada
  }
}
