import { Types } from 'mongoose';

interface Endereco {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  complementi: string;
}

interface De {
  _id: Types.ObjectId;
  nome: string;
  telefone: string;
  cpfCnpj: string;
  endereco: Endereco;
}

export interface Protocolo {
  _id: Types.ObjectId;
  protocolo: string;
  de: De;
  para: string;
  status: string;
  estagioBot: string;
  origem: string;
  minuta?: Types.ObjectId;
  sensivel: boolean;
  criadoEm: Date;
  atualizadoEm?: string;
}
