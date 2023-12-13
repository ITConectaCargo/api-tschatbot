import { Document, Schema, Types, model } from "mongoose";

export interface MensagemTemplate extends Document{
  _id: Types.ObjectId;
  texto: string
  modelo: string
}

const mensagemTemplateSchema = new Schema<MensagemTemplate>(
  {
    texto: { type: String, required: true },
    modelo: { type: String, required: true },
  }
);

const MensagemTemplateModel = model<MensagemTemplate>("MensagemTemplates", mensagemTemplateSchema);

export default MensagemTemplateModel;
