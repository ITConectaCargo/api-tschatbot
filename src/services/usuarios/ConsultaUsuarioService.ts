import { Usuario } from '@Interfaces/IUsuario';
import UsuarioModel from '@models/UsuarioModel';
import AppError from '@utils/AppError';
import { Types } from 'mongoose';

export default class ConsultaUsuarioService {
  public async porId(id: Types.ObjectId): Promise<Usuario> {
    const usuario = await UsuarioModel.findById(id);

    if (!usuario) {
      throw new AppError('Usuario não encontrado');
    }

    if (!usuario.estaAtivo) {
      throw new AppError('Usuario desativado');
    }

    return usuario;
  }
}
