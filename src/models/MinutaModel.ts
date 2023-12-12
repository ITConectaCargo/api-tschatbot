import { Schema, Document, model } from "mongoose";

export interface Minuta extends Document {
  _id: string;
  minuta: string;
  dataAgendamento?: Date;
  agendado?: boolean;
  agendadoPor?: string;
  criadoEm: Date,
  atualizadoEm?: Date
}

const minutaSchema = new Schema<Minuta>(
  {
    minuta: { type: String, required: true },
    dataAgendamento: { type: Date },
    agendado: { type: Boolean },
    agendadoPor: { type: String },
    criadoEm: {type: Date, default: Date.now },
    atualizadoEm: {type: Date}
  }
);

const MinutaModel = model<Minuta>("minutas", minutaSchema);

export default MinutaModel;
