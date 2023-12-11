import mongoose, { Schema, Types } from "mongoose";

interface Mensagem {
    protocolo?: string;
    remetente: Types.ObjectId;
    usuario?: Types.ObjectId;
    destinatario?: string;
    idMensagem?: string;
    status?: string;
    idTelefone?: string;
    timestamp?: string;
    tipo?: string;
    modelo?: string;
    parametros?: Record<string, unknown>;
    meta?: Record<string, unknown>;
    texto: string;
}

const mensagemSchema = new Schema<Mensagem>(
    {
        protocolo: { type: String },
        remetente: { type: Schema.Types.ObjectId, ref: 'contatos', required: true },
        usuario: { type: Schema.Types.ObjectId, ref: 'usuarios' },
        destinatario: { type: String },
        idMensagem: { type: String },
        status: { type: String },
        idTelefone: { type: String },
        timestamp: { type: String },
        tipo: { type: String },
        modelo: { type: String },
        parametros: { type: Object },
        meta: { type: Object },
        texto: { type: String, required: true },
    }
);

const MensagemModel = mongoose.model<Mensagem>("mensagens", mensagemSchema);

export default MensagemModel;
