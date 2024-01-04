import { Types } from 'mongoose';

export interface Usuario {
  _id: Types.ObjectId;
  nome: string;
  email: string;
  senha: string;
  acesso: string;
  departamento?: string;
  estaAtivo: boolean;
  criadoEm: Date;
  desabilitadoEm?: Date;
  ultimoLogin?: Date;
}
