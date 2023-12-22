import sql from '@configs/DbSql';
import { MysqlError } from 'mysql';

export default class PortalColeta {
  private static dbSql = sql;

  public async consultaPorChaveNfe(chaveNfe: string): Promise<any> {
    const query: string = `SELECT
      contatos.telefone, contatos.telefone2,
      entidades.nome AS nome_cliente, entidades.documento,
      enderecos.logradouro, enderecos.numero, bairros.nome AS bairro, ufs.sigla, enderecos.cep, enderecos.complemento,
      coletas.info_adicional
      FROM coletas
      JOIN clientes ON coletas.cliente_id = clientes.id
      JOIN entidades ON clientes.entidade_id = entidades.id
      JOIN contatos ON contatos.cpf_cnpj = entidades.documento
      JOIN enderecos ON coletas.end_origem_id = enderecos.id
      JOIN bairros ON enderecos.bairro_id = bairros.id
      JOIN cidades ON bairros.cidade_id = cidades.id
      JOIN ufs ON cidades.uf_id = ufs.id
      WHERE coletas.chave_nf = '${chaveNfe}'
    `

    const results = await this.executaQuery(query, [chaveNfe]);
    return results
  }

  public async consultaEmbarcador(chaveNfe: string): Promise<any> {
    const query: string = `
      SELECT entidades.nome, entidades.documento FROM coletas
      JOIN embarcadores ON embarcadores.id = coletas.embarcador_id
      JOIN entidades ON entidades.id = embarcadores.entidade_id
      WHERE coletas.chave_nf = '${chaveNfe}';
    `

    const results = await this.executaQuery(query, [chaveNfe]);
    return results
  }

  public async consultaProduto(chaveNfe: string): Promise<string> {
    const query: string = `
    SELECT GROUP_CONCAT(DISTINCT produtos.descricao_produto SEPARATOR ' [+] ') AS descricao_produto
    FROM coletas
    JOIN coleta_produtos AS produtosNf ON produtosNf.nf_id = coletas.id
    JOIN produtos ON produtos.cod_produto = produtosNf.cod_produto
    WHERE coletas.chave_nf = '${chaveNfe}'
    GROUP BY produtos.cod_produto
    `

    const results = await this.executaQuery(query, [chaveNfe]);

    if(results[0]) {
      const descricao = results[0].descricao_produto
      return descricao
    }
    else {
      return "Produto não cadastrado"
    }
  }

  public async consultaUrlChecklist(raizCnpj: string): Promise<any> {
    const query = `
      SELECT * FROM bot_checklist WHERE raizCnpj = ${raizCnpj}
    `;

    const resultado = await this.executaQuery(query, [raizCnpj])
    return resultado
  }

  private async executaQuery(query: string, params: any[], timeout: number = 600000): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject({ message: 'Tempo limite excedido ao executar a consulta.' });
      }, timeout);

      PortalColeta.dbSql.query(query, params, (error: MysqlError | null, results?: any[]) => {
        clearTimeout(timeoutId);
        if (error) {
          console.error('Erro ao executar a consulta: ' + error.stack);
          reject({ message: 'Erro ao buscar dados.' });
        } else {
          resolve(results || []);
        }
      });
    });
  }
}
