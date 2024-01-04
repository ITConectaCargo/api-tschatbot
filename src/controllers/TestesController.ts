import ConsultaMinutaService from '@services/minutas/ConsultaMinutaService';
import Checklist from '@utils/Checklist';
import { Request, Response } from 'express';

interface DadosChecklist {
  motivo: string;
  detalhes: string;
}

export default class TestesController {
  public async teste1(req: Request, res: Response): Promise<void> {
    const chaveNfe = req.body.chaveNfe;
    const dados: DadosChecklist[] = [];

    const checklist = new Checklist();
    for (const chave of chaveNfe) {
      const check = await checklist.consultar(chave);
      dados.push(check);
    }
    res.status(200).send(dados);
  }

  public async teste2(req: Request, res: Response): Promise<void> {
    const consultaMinuta = new ConsultaMinutaService();
    const minutas = await consultaMinuta.todasHoje();

    const minutasChave: string[] = [];
    const semProduto: string[] = [];
    const produto: string[] = [];
    const semDados: string[] = [];

    for (const minuta of minutas) {
      minutasChave.push(minuta.chaveNfe);
      if (
        minuta.descricaoProduto &&
        minuta.descricaoProduto === 'Produto não cadastrado'
      ) {
        semProduto.push(minuta.chaveNfe);
      } else if (minuta.descricaoProduto) {
        produto.push(minuta.chaveNfe);
      } else {
        semDados.push(minuta.chaveNfe);
      }
    }

    const dados = {
      numMinutas: minutas.length,
      numSemProduto: semProduto.length,
      numSemDados: semDados.length,
      semProduto,
      produto,
      semDados,
      minutasChave,
    };

    res.status(200).json(dados);
  }
}
