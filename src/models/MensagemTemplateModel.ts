import { MensagemTemplate } from '@Interfaces/IMensagemTemplate';
import { Schema, model } from 'mongoose';

const mensagemTemplateSchema = new Schema<MensagemTemplate>({
  texto: { type: String, required: true },
  modelo: { type: String, required: true },
});

const MensagemTemplateModel = model<MensagemTemplate>(
  'MensagemTemplates',
  mensagemTemplateSchema,
);

export default MensagemTemplateModel;
