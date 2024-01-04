import CriarContatoService from '@services/contatos/CriarContatoService';
import { Request, Response } from 'express';

export default class ContatoController {
  public async criar(req: Request, res: Response): Promise<void> {
    const contato = {
      nome: req.body.nome,
      telefone: req.body.telefone,
      telefone2: req.body.telefone2,
      telefone3: req.body.telefone3,
      cpfCnpj: req.body.cpfCnpj,
      endereco: {
        rua: req.body.endereco.rua,
        numero: req.body.endereco.numero,
        bairro: req.body.endereco.bairro,
        cidade: req.body.endereco.cidade,
        estado: req.body.endereco.estado,
        cep: req.body.endereco.cep,
        complemento: req.body.endereco.complemento,
      },
      admin: req.body.admin,
      estaAtivo: req.body.estaAtivo,
    };

    const criarContato = new CriarContatoService();
    const contatoCriado = await criarContato.executar(contato);

    if (contatoCriado) {
      res.status(200).json(contatoCriado);
    } else {
      res.status(400).json({ message: 'Erro ao criar' });
    }
  }
}
