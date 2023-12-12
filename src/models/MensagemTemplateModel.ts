import { Schema, model } from "mongoose";

export interface MensagemTemplate {
  _id: string;
  text: string
  model: string
}

const mensagemTemplateSchema = new Schema<MensagemTemplate>(
  {
    text: { type: String, required: true },
    model: { type: String, required: true },
  }
);

const MensagemTemplate = model<MensagemTemplate>("MensagemTemplates", mensagemTemplateSchema);

export default MensagemTemplate;
