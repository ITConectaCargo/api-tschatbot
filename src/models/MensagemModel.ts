import { Mensagem } from '@Interfaces/IMensagem';
import { Schema, model } from 'mongoose';

const mensagemSchema = new Schema<Mensagem>({
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
  meta: { type: String },
  usuario: { type: Schema.Types.ObjectId, ref: 'usuarios' },
  criadoEm: { type: Date, default: Date.now },
  atualizadoEm: { type: Date },
});

const MensagemModel = model<Mensagem>('mensagens', mensagemSchema);

export default MensagemModel;
