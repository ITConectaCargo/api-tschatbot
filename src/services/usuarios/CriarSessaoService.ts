import UsuarioModel from '@models/UsuarioModel';
import AppError from '@utils/AppError';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { Types } from 'mongoose';

interface SessaoParams {
  email: string;
  senha: string;
}

interface Autenticado {
  usuario: Types.ObjectId;
  token: string;
}

export default class CriarSessaoService {
  public async executar({ email, senha }: SessaoParams): Promise<Autenticado> {
    const usuario = await UsuarioModel.findOne({ email: email })
      .select('senha estaAtivo')
      .exec();

    if (!usuario) {
      throw new AppError('Usuario e/ou senha incorreto', 401);
    }

    if (!usuario.estaAtivo) {
      throw new AppError('Usuario e/ou senha incorreto', 401);
    }

    const senhaValida = await compare(senha, usuario.senha);

    if (!senhaValida) {
      throw new AppError('Usuario e/ou senha incorreto', 401);
    }

    const token = sign({ id: usuario._id }, process.env.SECRET!, {
      expiresIn: 28800, //8 horas
    });

    const autenticado = {
      usuario: usuario._id,
      token,
    };

    return autenticado;
  }
}
