import { Document, Schema, Types, model } from "mongoose";

interface Endereco {
  street: string,
  district: string,
  number: string,
  city: string,
  state: string,
  cep: string,
  complement: string
}

interface De {
  _id: Types.ObjectId,
  nome: string,
  telefone: string,
  cpfCnpj: string,
  endereco: Endereco
}

export interface Protocolo extends Document {
  _id: Types.ObjectId
  protocolo: string
  de: De
  para: string
  status: string
  estagioBot: string
  origem: string
  minuta?: Types.ObjectId
  sensivel: boolean
  criadoEm: Date
  atualizadoEm?: string
}

const protocoloSchema = new Schema<Protocolo>({
  protocolo: { type: String },
  de: {
    _id: { type: Schema.Types.ObjectId, ref: 'contatos' },
    nome: { type: String },
    telefone: { type: String },
    cpfCnpj: { type: String },
    endereco: {
      street: { type: String },
      district: { type: String },
      number: { type: String },
      city: { type: String },
      state: { type: String },
      cep: { type: String },
      complement: { type: String }
    }
  },
  para: { type: String },
  status: { type: String },
  estagioBot: { type: String },
  origem: { type: String },
  minuta: { type: Schema.Types.ObjectId, ref: 'minutas' },
  sensivel: { type: Boolean },
  criadoEm: { type: Date, default: Date.now },
  atualizadoEm: { type: Date }
});

const ProtocoloModel = model<Protocolo>("protocolos", protocoloSchema)

export default ProtocoloModel
