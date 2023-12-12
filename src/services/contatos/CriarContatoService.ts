import ContatoModel, {Contato} from "@models/ContatoModel";

interface Endereco {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  complemento: string;
  referencia?: string;
}

interface ContatoParams {
  _id?: string;
  nome: string;
  telefone: string;
  telefone2?: string;
  telefone3?: string;
  cpfCnpj: string;
  endereco: Endereco;
  admin?: boolean;
  estaAtivo: boolean;
}

export default class CriarContatoService {
  public async executar({
    nome,
    telefone,
    telefone2,
    telefone3,
    cpfCnpj,
    endereco,
    admin = false,
    estaAtivo,
  }: ContatoParams): Promise<Contato> {
    const novoContato = new ContatoModel({
      nome,
      telefone,
      telefone2,
      telefone3,
      cpfCnpj,
      endereco,
      admin,
      estaAtivo,
    });

    const contatoSalvo = await novoContato.save();
    return contatoSalvo;
  }
}
