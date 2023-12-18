import ProtocoloModel, { Protocolo } from "@models/ProtocoloModel";
import { Types } from "mongoose";

export default class ConsultaProtocoloService {
  public async porContatoId(contatoId: Types.ObjectId): Promise<Protocolo | null> {
    const protocolo = ProtocoloModel.findOne({ 'de._id': contatoId })
    if (protocolo) return protocolo
    return null
  }

  public async porTelefone(telefone: string): Promise<Protocolo | null> {
    const protocolo = await ProtocoloModel.findOne({ 'de.telefone': telefone })
    if (protocolo) return protocolo
    return null
  }
}
