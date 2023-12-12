import sql from '@configs/DbSql';
import { Query, MysqlError } from 'mysql';

export default class PortalColeta {
  private static dbSql = sql;

  public async consultaPorChaveNfe(chaveNfe: string): Promise<any> {
    const query: string = `SELECT
          mkt.nomeMkt,
          origem.cpfCnpj,
          origem.telefoneOrigem AS telefone,
          GROUP_CONCAT(contA.telefone ORDER BY contA.telefone ASC SEPARATOR ' | ') AS telefone2,
          GROUP_CONCAT(contA.telefone2 ORDER BY contA.telefone2 ASC SEPARATOR ' | ') AS telefone3,
          pv_ocorr.Telefones AS telefone4,
          origem.enderecoOrigem,
          origem.numero,
          origem.bairroOrigem,
          origem.cidadeOrigem,
          origem.uf,
          origem.cepOrigem,
          clientes.complemento,
          info.infoAdicional,
          pv_ocorr.Infos_Adicionais
      FROM
          tbl_coleta_origem AS origem
      JOIN
          clientes AS cli ON origem.cpfCnpj = cli.cpfCnpj
      LEFT JOIN
          tbl_contatos AS contA ON contA.cpfCnpj = origem.cpfCnpj
      LEFT JOIN
          marketplace AS mkt ON mkt.cnpjCpf = origem.cnpjCpf
      LEFT JOIN
          ccdblog.python_viavarejo_ocorrencias AS pv_ocorr ON pv_ocorr.Filename LIKE CONCAT('%', origem.chaveNfe, '%')
      LEFT JOIN
          tbl_info_adicional AS info ON info.chaveNf = origem.chaveNfe
      LEFT JOIN
          clientes ON clientes.cpfCnpj = origem.cpfCnpj AND clientes.logradouro = origem.enderecoOrigem
      WHERE
          origem.chaveNfe = "${chaveNfe}"
      LIMIT 1`;

    const results = await this.executaQuery(query, [chaveNfe]);
    return results
  }

  public async consultaPorCpfCnpj(cpfCnpj: string): Promise<any> {
    cpfCnpj = cpfCnpj.replace(/[^\d]+/g, '');
    const query: string = `
            SELECT DISTINCT
	            tbl_coleta.cpfCnpj,
                clientes.nomeCliente,
                tbl_coleta_origem.enderecoOrigem,
                tbl_coleta_origem.numero,
                tbl_coleta_origem.bairroOrigem,
                tbl_coleta_origem.cidadeOrigem,
                tbl_coleta_origem.uf,
                tbl_coleta_origem.cepOrigem,
                tbl_coleta.valorTotalNf,
                tbl_coleta.chaveNfe,
                tbl_coleta_produto.descricaoProduto,
                marketplace.cnpjCpf,
                marketplace.uf as ufEmbarcador,
                marketplace.cidade as cidadeEmbarcador,
                marketplace.nomeMkt
            FROM
                tbl_coleta
            INNER JOIN
                clientes ON tbl_coleta.cpfCnpj = clientes.cpfCnpj
            INNER JOIN
                marketplace ON tbl_coleta.cnpjCpf = marketplace.cnpjCpf
            INNER JOIN
                mktclientesnfe ON tbl_coleta.chaveNfe = mktclientesnfe.chaveNFe
            INNER JOIN
                tbl_coleta_produto ON mktclientesnfe.codProduto = tbl_coleta_produto.codProduto
            INNER JOIN
                tbl_coleta_origem ON tbl_coleta.chaveNfe = tbl_coleta_origem.chaveNfe
            WHERE
                clientes.cpfCnpj = ${cpfCnpj}`;

    const resultado = await this.executaQuery(query, [cpfCnpj])
    return resultado
  }

  public async consultaPorTelefone(telefone: string): Promise<any> {
    telefone = telefone.slice(2); // Remove o prefixo (por exemplo, '55')
    const query: string = `
            SELECT DISTINCT
                tbl_coleta.cpfCnpj,
                clientes.nomeCliente,
                tbl_coleta_origem.enderecoOrigem,
                tbl_coleta_origem.numero,
                tbl_coleta_origem.bairroOrigem,
                tbl_coleta_origem.cidadeOrigem,
                tbl_coleta_origem.uf,
                tbl_coleta_origem.cepOrigem,
                tbl_coleta.valorTotalNf,
                tbl_coleta.chaveNfe,
                tbl_coleta_produto.descricaoProduto,
                marketplace.cnpjCpf,
                marketplace.uf as ufEmbarcador,
                marketplace.cidade as cidadeEmbarcador,
                marketplace.nomeMkt
            FROM
                tbl_coleta
            INNER JOIN
                clientes ON tbl_coleta.cpfCnpj = clientes.cpfCnpj
            INNER JOIN
                marketplace ON tbl_coleta.cnpjCpf = marketplace.cnpjCpf
            INNER JOIN
                mktclientesnfe ON tbl_coleta.chaveNfe = mktclientesnfe.chaveNFe
            INNER JOIN
                tbl_coleta_produto ON mktclientesnfe.codProduto = tbl_coleta_produto.codProduto
            INNER JOIN
                tbl_coleta_origem ON tbl_coleta.chaveNfe = tbl_coleta_origem.chaveNfe
            left JOIN
                tbl_contatos ON tbl_coleta.cpfCnpj = tbl_contatos.cpfCnpjs
            WHERE
                clientes.foneCliente = ${telefone}
                OR tbl_contatos.telefone = ${telefone}
                OR tbl_contatos.telefone2 = ${telefone}
            `;

    const resultado = await this.executaQuery(query, [telefone])
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
