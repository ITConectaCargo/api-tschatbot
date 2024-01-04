import { Types } from 'mongoose';
import { Contato } from './Icontato';

export interface Mensagem extends Document {
  _id: Types.ObjectId;
  protocolo: string;
  remetente: Types.ObjectId | Contato;
  destinatario: string;
  texto: string;
  idMensagem?: string;
  status: string;
  idTelefone: string;
  timestamp: string;
  tipo: string;
  modelo?: string;
  meta?: string;
  usuario?: Types.ObjectId;
  criadoEm: Date;
  atualizadoEm?: Date;
}
