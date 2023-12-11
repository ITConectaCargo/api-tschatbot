import mongoose, { Schema, Document } from "mongoose";

interface Minuta extends Document {
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

const MinutaModel = mongoose.model<Minuta>("minutas", minutaSchema);

export default MinutaModel;
