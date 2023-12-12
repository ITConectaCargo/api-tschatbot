import ContatoModel, { Contato } from "@models/ContatoModel";
import AppError from "@utils/AppError";
import moment from "moment";

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
  _id?: string;
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
  public async executar({
    _id,
    nome,
    telefone,
    telefone2,
    telefone3,
    cpfCnpj,
    endereco,
    admin,
    estaAtivo,
  }: ContatoParams): Promise<Contato | null> {
    const contatoAtualizado = await ContatoModel.findByIdAndUpdate(
      _id,
      {
        $set: {
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
      },
      { new: true } // Retorna o documento atualizado
    );

    return contatoAtualizado;
  }
}
