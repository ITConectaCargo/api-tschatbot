import ConsultaUsuarioService from '@services/usuarios/ConsultaUsuarioService';
import CriarSessaoService from '@services/usuarios/CriarSessaoService';
import CriarUsuarioService from '@services/usuarios/CriarUsuarioService';
import { Request, Response } from 'express';
import { Types } from 'mongoose';

export default class UsuarioController {
  public async criar(req: Request, res: Response): Promise<Response> {
    const usuario = {
      nome: req.body.nome,
      email: req.body.email,
      senha: req.body.senha,
      confirmaSenha: req.body.confirmaSenha,
      departamento: req.body.departamento,
      acesso: req.body.acesso,
    };

    if (usuario.senha !== usuario.confirmaSenha) {
      return res.status(401).json({ message: 'Usuario e/ou senha incorretos' });
    }

    const criarUsuario = new CriarUsuarioService();
    const novoUsuario = await criarUsuario.executar(usuario);

    if (novoUsuario) {
      return res.status(200).json({ message: 'Usuario criado com sucesso' });
    }

    return res.status(400).json({ message: 'Erro ao criar usuario' });
  }

  public async logar(req: Request, res: Response): Promise<Response> {
    const email = req.body.email;
    const senha = req.body.senha;

    const criaSessao = new CriarSessaoService();
    const token = await criaSessao.executar({ email, senha });

    if (!token) {
      return res.status(401).json({ message: 'Erro ao criar token' });
    }

    return res.status(200).json(token);
  }

  public async consulta(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;
    const ObjectId = new Types.ObjectId(id);

    const consultaUsuario = new ConsultaUsuarioService();
    const usuario = await consultaUsuario.porId(ObjectId);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario não encontrado' });
    }

    return res.status(200).json(usuario);
  }
}
