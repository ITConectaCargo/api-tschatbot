import { Types } from 'mongoose';

export interface Embarcador {
  _id: Types.ObjectId;
  cpfCnpj: string;
  nome: string;
}
