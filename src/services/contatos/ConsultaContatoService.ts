import ContatoModel, { Contato } from '@models/ContatoModel';
import AppError from '@utils/AppError';
import { Types } from 'mongoose';

export default class ConsultaContatoService {
  public async porCpfCnpj(cpfCnpj: string): Promise<Contato | null> {
    const contato = await ContatoModel.findOne({ cpfCnpj });

    if (!contato?.estaAtivo) {
      return null;
    }
    return contato;
  }

  public async porTelefone(telefone: string): Promise<Contato | null> {
    const contato = await ContatoModel.findOne({ telefone: telefone });

    if (!contato?.estaAtivo) {
      return null;
    }
    return contato;
  }

  public async porId(id: Types.ObjectId): Promise<Contato | null> {
    const contato = await ContatoModel.findById(id);

    if (!contato?.estaAtivo) {
      return null;
    }
    return contato;
  }

  public async contatoAdm(): Promise<Contato> {
    const contato = await ContatoModel.findOne({ admin: true });

    if (!contato || contato?.estaAtivo === false) {
      throw new AppError('Contato Admin Não localizado ou Contato desativado');
    }
    return contato;
  }
}
