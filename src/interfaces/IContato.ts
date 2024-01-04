import { Types } from 'mongoose';

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

export interface Contato {
  _id: Types.ObjectId;
  nome: string;
  telefone: string;
  telefone2?: string;
  telefone3?: string;
  cpfCnpj?: string;
  endereco?: Endereco;
  admin?: boolean;
  estaAtivo?: boolean;
  criadoEm: Date;
  atualizadoEm?: Date;
}
