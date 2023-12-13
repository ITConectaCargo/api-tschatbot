import { Moment } from "moment";
import { Schema, Document, model, Types } from "mongoose";

export interface Minuta extends Document {
  _id: Types.ObjectId;
  minuta: string;
  chaveNfe: string
  descricaoProduto?: string
  embarcador?: Types.ObjectId
  protocolo?: string[]
  dataAgendamento?: Moment;
  agendado?: boolean;
  agendadoPor?: string;
  criadoEm: Date,
  atualizadoEm?: Date
}

const minutaSchema = new Schema<Minuta>(
  {
    minuta: { type: String, required: true },
    chaveNfe: { type: String, required: true },
    descricaoProduto: { type: String },
    embarcador: { type: Schema.Types.ObjectId, ref: 'embarcadores' },
    protocolo: [{ type: String }],
    dataAgendamento: { type: Date },
    agendado: { type: Boolean },
    agendadoPor: { type: String },
    criadoEm: { type: Date, default: Date.now },
    atualizadoEm: { type: Date }
  }
);

const MinutaModel = model<Minuta>("minutas", minutaSchema);

export default MinutaModel;
