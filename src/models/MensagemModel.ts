import { Document, Schema, Types, model } from "mongoose";

export interface Mensagem extends Document {
  _id: Types.ObjectId;
  protocolo: string;
  remetente: Types.ObjectId;
  destinatario: string;
  texto: string;
  idMensagem?: string;
  status: string;
  idTelefone: string;
  timestamp: string;
  tipo: string;
  modelo?: string;
  parametros?: Record<string, unknown>;
  meta?: Record<string, unknown>;
  usuario?: Types.ObjectId;
  criadoEm: Date
  atualizadoEm?: Date
}

const mensagemSchema = new Schema<Mensagem>(
  {
    protocolo: { type: String },
    remetente: { type: Schema.Types.ObjectId, ref: 'contatos', required: true },
    destinatario: { type: String },
    texto: { type: String, required: true },
    idMensagem: { type: String },
    status: { type: String },
    idTelefone: { type: String },
    timestamp: { type: String },
    tipo: { type: String },
    modelo: { type: String },
    parametros: { type: Object },
    meta: { type: Object },
    usuario: { type: Schema.Types.ObjectId, ref: 'usuarios' },
    criadoEm: { type: Date, default: Date.now },
    atualizadoEm: { type: Date }
  }
);

const MensagemModel = model<Mensagem>("mensagens", mensagemSchema);

export default MensagemModel;
