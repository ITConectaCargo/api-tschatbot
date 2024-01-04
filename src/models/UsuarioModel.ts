import { Schema, model } from 'mongoose';
import { Usuario } from '@Interfaces/IUsuario';

const UsuarioSchema = new Schema<Usuario>({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  senha: { type: String, required: true, select: false },
  acesso: { type: String, required: true },
  departamento: { type: String },
  estaAtivo: { type: Boolean },
  criadoEm: { type: Date, default: Date.now },
  desabilitadoEm: { type: Date },
  ultimoLogin: { type: Date },
});

const UsuarioModel = model<Usuario>('Usuarios', UsuarioSchema);

export default UsuarioModel;
