import { Document, Schema, Types, model } from "mongoose";

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

export interface Contato extends Document {
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
  atualizadoEm?: Date
}

const contatoSchema = new Schema<Contato>({
  nome: { type: String, required: true },
  telefone: { type: String, required: true },
  telefone2: { type: String },
  telefone3: { type: String },
  cpfCnpj: { type: String },
  endereco: {
    rua: { type: String },
    numero: { type: String },
    bairro: { type: String },
    cidade: { type: String },
    estado: { type: String },
    cep: { type: String },
    complemento: { type: String },
    referencia: { type: String },
  },
  admin: { type: Boolean },
  estaAtivo: { type: Boolean },
  criadoEm: { type: Date, default: Date.now },
  atualizadoEm: { type: Date }
});

const ContatoModel = model<Contato>("contatos", contatoSchema);

export default ContatoModel;
