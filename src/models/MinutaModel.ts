import { Minuta } from '@Interfaces/IMinuta';
import { Schema, model } from 'mongoose';

const minutaSchema = new Schema<Minuta>({
  minuta: { type: String, required: true },
  chaveNfe: { type: String, required: true },
  descricaoProduto: { type: String },
  embarcador: { type: Schema.Types.ObjectId, ref: 'embarcadores' },
  protocolo: [{ type: String }],
  codigoOcorrencia: { type: Number },
  descricaoOcorrencia: { type: String },
  dataAgendamento: { type: Date },
  agendado: { type: Boolean },
  agendadoPor: { type: String },
  checklist: {
    motivo: { type: String },
    detalhes: { type: String },
  },
  criadoEm: { type: Date, default: Date.now },
  atualizadoEm: { type: Date },
});

const MinutaModel = model<Minuta>('minutas', minutaSchema);

export default MinutaModel;
