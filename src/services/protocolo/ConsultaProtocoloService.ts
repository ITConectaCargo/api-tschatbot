import { Protocolo } from '@Interfaces/IProtocolo';
import ProtocoloModel from '@models/ProtocoloModel';
import { Types } from 'mongoose';

export default class ConsultaProtocoloService {
  public async porContatoId(
    contatoId: Types.ObjectId,
  ): Promise<Protocolo | null> {
    const protocolo = ProtocoloModel.findOne({ 'de._id': contatoId })
      .sort({ criadoEm: -1 })
      .exec();

    if (protocolo) return protocolo;
    return null;
  }

  public async porTelefone(telefone: string): Promise<Protocolo | null> {
    const protocolo = await ProtocoloModel.findOne({ 'de.telefone': telefone })
      .sort({ criadoEm: -1 })
      .exec();

    if (!protocolo) return null;
    return protocolo;
  }
}
