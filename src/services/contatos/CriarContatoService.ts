import ContatoModel, { Contato } from '@models/ContatoModel';
import ConsultaContatoService from './ConsultaContatoService';

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
  nome: string;
  telefone: string;
  telefone2?: string;
  telefone3?: string;
  cpfCnpj?: string;
  endereco?: Endereco;
  admin?: boolean;
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
  }: ContatoParams): Promise<Contato> {
    const constultaContato = new ConsultaContatoService();

    if (telefone) {
      const contato = await constultaContato.porTelefone(telefone);
      if (contato) {
        return contato;
      }
    }

    if (cpfCnpj) {
      const contato = await constultaContato.porCpfCnpj(cpfCnpj);

      if (contato) {
        return contato;
      }
    }

    const novoContato = new ContatoModel({
      nome,
      telefone,
      telefone2,
      telefone3,
      cpfCnpj,
      endereco,
      admin,
      estaAtivo: true,
    });

    const contatoSalvo = await novoContato.save();
    return contatoSalvo;
  }
}
