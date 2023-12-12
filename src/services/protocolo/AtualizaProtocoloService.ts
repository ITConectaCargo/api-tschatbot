import ProtocoloModel, { Protocolo } from "@models/ProtocoloModel";
import moment from "moment";

export default class AtualizaProtocoloService {
  public async executar(
    _id: string,
    status: string,
    estagioBot: string,

  ): Promise<Protocolo | null> {
    const protocolo = await ProtocoloModel.findByIdAndUpdate(
      _id,
      {
        $set: {
          status,
          estagioBot,
          atualizadoEm: moment(),
        },
      },
      { new: true }
    )

    if(protocolo) return protocolo
    return null
  }
}

