import { Types } from 'mongoose';

export interface MensagemTemplate {
  _id: Types.ObjectId;
  texto: string;
  modelo: string;
}
