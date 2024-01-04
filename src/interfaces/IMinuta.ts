import { Moment } from 'moment';
import { Types } from 'mongoose';
import { Embarcador } from './IEmbarcador';

interface Checklist {
  motivo?: string;
  detalhes?: string;
}

export interface Minuta extends Document {
  _id: Types.ObjectId;
  minuta: string;
  chaveNfe: string;
  codigoOcorrencia: number;
  descricaoOcorrencia: string;
  descricaoProduto?: string;
  embarcador?: Types.ObjectId | Embarcador;
  protocolo?: string[];
  dataAgendamento?: Moment;
  agendado?: boolean;
  agendadoPor?: string;
  checklist?: Checklist;
  criadoEm: Date;
  atualizadoEm?: Date;
}
