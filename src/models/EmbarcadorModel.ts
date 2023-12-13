import { Document, Schema, Types, model } from "mongoose";

export interface Embarcador extends Document {
  _id: Types.ObjectId;
  cpfCnpj: string
  nome: string
}

const embarcadorSchema = new Schema<Embarcador>(
  {
    cpfCnpj: { type: String, required: true },
    nome: { type: String, required: true },
  }
);

const EmbarcadorModel = model<Embarcador>("EmbarcadorTemplates", embarcadorSchema);

export default EmbarcadorModel;
