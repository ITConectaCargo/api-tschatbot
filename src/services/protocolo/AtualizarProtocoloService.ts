import ProtocoloModel, { Protocolo } from "@models/ProtocoloModel";
import moment from "moment";
import { Types } from "mongoose";

export default class AtualizarProtocoloService {
  public async executar(
    _id: Types.ObjectId,
    status: string,
    estagioBot: string,

  ): Promise<Protocolo | null> {
    const protocolo = await ProtocoloModel.findByIdAndUpdate(
      _id,
      {
        status,
        estagioBot,
        atualizadoEm: moment(),
      },
      { new: true }
    )

    if (protocolo) return protocolo
    return null
  }
}

