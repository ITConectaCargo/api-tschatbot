import ContatoModel, { Contato } from "@models/ContatoModel";
import AppError from "@utils/AppError";
import { Types } from "mongoose";

export default class ConsultaContatoService {
  public async porCpfCnpj(cpfCnpj: string): Promise<Contato> {
    const contato = await ContatoModel.findOne({ cpfCnpj });

    if(!contato?.estaAtivo){
      throw new AppError('Contato Não localizado ou Contato desativado');
    }
    return contato
  }

  public async porId(id: Types.ObjectId): Promise<Contato> {
    const contato = await ContatoModel.findById(id);

    if(!contato?.estaAtivo){
      throw new AppError('Contato Não localizado ou Contato desativado');
    }
    return contato
  }

  public async contatoAdm(): Promise<Contato> {
    const contato = await ContatoModel.findOne({ admin: true });

    if(!contato?.estaAtivo){
      throw new AppError('Contato Não localizado ou Contato desativado');
    }
    return contato
  }
}
