import ContatoModel, { Contato } from "@models/ContatoModel";
import AppError from "@utils/AppError";
import moment from "moment";
import { Types } from "mongoose";

interface Endereco {
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  complemento?: string;
  referencia?: string;
}

interface ContatoParams {
  _id: Types.ObjectId;
  nome?: string;
  telefone?: string;
  telefone2?: string;
  telefone3?: string;
  cpfCnpj?: string;
  endereco?: Endereco;
  admin?: boolean;
  estaAtivo?: boolean;
}

export default class AtualizarContatoService {
  public async porId({
    _id,
    nome,
    telefone,
    telefone2,
    telefone3,
    cpfCnpj,
    endereco,
    admin,
    estaAtivo,
  }: ContatoParams): Promise<Contato> {
    const contatoAtualizado = await ContatoModel.findByIdAndUpdate(
      _id,
      {
        nome,
        telefone,
        telefone2,
        telefone3,
        cpfCnpj,
        endereco,
        admin,
        estaAtivo,
        atualizadoEm: moment()
      },
      { new: true } // Retorna o documento atualizado
    );

    if(!contatoAtualizado) {
      throw new AppError('Contato não localizado');
    }

    return contatoAtualizado;
  }
}
