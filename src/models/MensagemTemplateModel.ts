import mongoose, { Schema } from "mongoose";

interface MensagemTemplate  {
    text: string;
    model: string;
}

const mensagemTemplateSchema = new Schema<MensagemTemplate>(
    {
        text: { type: String, required: true },
        model: { type: String, required: true },
    }
);

const MensagemTemplateModel = mongoose.model<MensagemTemplate>("mensagemTemplates", mensagemTemplateSchema);

export default MensagemTemplateModel;
