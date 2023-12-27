import UsuarioModel, { Usuario } from "@models/UsuarioModel"
import AppError from "@utils/AppError"
import { hash } from "bcryptjs"

interface UsuarioParams {
  nome: string
  email: string
  senha: string
  acesso: string
  departamento?: string
}

export default class CriarUsuarioService {
  public async executar({
    nome,
    email,
    senha,
    acesso,
    departamento
  }: UsuarioParams): Promise<Usuario> {
    const usuario = await UsuarioModel.findOne({ email: email })

    if (usuario) {
      throw new AppError('Usuario já existe')
    }

    const senhaCriptografada = await hash(senha, 8)

    const novoUsuario = new UsuarioModel({
      nome,
      email,
      senha: senhaCriptografada,
      acesso,
      departamento,
      estaAtivo: true,
    })

    const usuarioSalvo = await novoUsuario.save();
    return usuarioSalvo;
  }
}
