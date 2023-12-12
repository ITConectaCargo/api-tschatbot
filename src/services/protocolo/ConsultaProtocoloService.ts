import ProtocoloModel, { Protocolo } from "@models/ProtocoloModel";

export default class ConsultaProtocoloService {
  public async porContatoId(contatoId: string): Promise<Protocolo | null> {
    const protocolo = ProtocoloModel.findOne({ 'de._id': contatoId })
    if (protocolo) return protocolo
    return null
  }
}
