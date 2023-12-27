import { Document, Schema, Types, model } from "mongoose";

export interface Usuario extends Document {
  _id: Types.ObjectId;
  nome: string
  email: string
  senha: string
  acesso: string
  departamento?: string
  estaAtivo: boolean
  criadoEm: Date
  desabilitadoEm?: Date
  ultimoLogin?: Date
}

const UsuarioSchema = new Schema<Usuario>(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true },
    senha: { type: String, required: true, select: false },
    acesso: { type: String, required: true },
    departamento: { type: String },
    estaAtivo: { type: Boolean },
    criadoEm: { type: Date, default: Date.now },
    desabilitadoEm: { type: Date },
    ultimoLogin: { type: Date },
  }
);

const UsuarioModel = model<Usuario>("Usuarios", UsuarioSchema);

export default UsuarioModel;
