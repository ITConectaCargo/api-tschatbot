import mongoose, { Document } from "mongoose";

interface Endereco {
    rua?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    complemento?: string;
    referencia?: string;
}

interface Contato extends Document {
    nome: string;
    tel: string;
    tel2?: string;
    tel3?: string;
    cpfCnpj?: string;
    endereco?: Endereco;
    admin?: boolean;
    estaAtivo?: boolean;
    criadoEm: Date;
    atualizadoEm: Date
}

const contatoSchema = new mongoose.Schema<Contato>({
    nome: { type: String, required: true },
    tel: { type: String, required: true },
    tel2: { type: String },
    tel3: { type: String },
    cpfCnpj: { type: String },
    endereco: {
        rua: { type: String },
        numero: { type: String },
        bairro: { type: String },
        cidade: { type: String },
        estado: { type: String },
        cep: { type: String },
        complemento: { type: String },
        referencia: { type: String },
    },
    admin: { type: Boolean },
    estaAtivo: { type: Boolean },
    criadoEm: { type: Date, default: Date.now },
    atualizadoEm: { type: Date }
});

const ContatoModel = mongoose.model<Contato>("contatos", contatoSchema);

export default ContatoModel;
