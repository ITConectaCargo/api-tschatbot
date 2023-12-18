import sql from '@configs/DbSql';
import { MysqlError } from 'mysql';

export default class PortalColeta {
  private static dbSql = sql;

  public async consultaPorChaveNfe(chaveNfe: string): Promise<any> {
    const query: string = `SELECT
    entidade_embarcador.nome AS nome_embarcador,
    coletas.info_adicional,
    entidade_cliente.nome AS nome_cliente,
    entidade_cliente.documento AS cpf_cnpj_cliente,
    contatos_cliente.telefone AS telefone_cliente,
    contatos_cliente.telefone2 AS telefone2_cliente,
    contatos_cliente.email AS email_cliente,
    origem.cep,
    cidades_origem.nome as cidade,
    bairros_origem.nome as bairro,
    ufs_origem.sigla as uf,
    origem.logradouro,
    origem.numero,
    origem.complemento
    FROM coletas
    JOIN clientes ON coletas.cliente_id = clientes.id
    JOIN entidades as entidade_cliente ON clientes.entidade_id = entidade_cliente.id
    JOIN contatos as contatos_cliente ON entidade_cliente.documento = contatos_cliente.cpf_cnpj
    JOIN enderecos as origem ON coletas.end_origem_id = origem.id
    JOIN bairros as bairros_origem ON origem.bairro_id = bairros_origem.id
    JOIN cidades as cidades_origem ON bairros_origem.cidade_id = cidades_origem.id
    JOIN ufs as ufs_origem ON cidades_origem.uf_id = ufs_origem.id
    JOIN embarcadores ON coletas.embarcador_id = embarcadores.id
    JOIN entidades as entidade_embarcador ON embarcadores.entidade_id = entidade_embarcador.id
    JOIN contatos as contatos_embarcador ON entidade_embarcador.documento = contatos_embarcador.cpf_cnpj
    JOIN enderecos as destino ON coletas.end_destino_id = destino.id
    JOIN bairros as bairros_destino ON destino.bairro_id = bairros_destino.id
    JOIN cidades as cidades_destino ON bairros_destino.cidade_id = cidades_destino.id
    JOIN ufs as ufs_destino ON cidades_destino.uf_id = ufs_destino.id
    WHERE coletas.chave_nf = '${chaveNfe}'`;

    const results = await this.executaQuery(query, [chaveNfe]);
    return results
  }

  public async consultaPorCpfCnpj(cpfCnpj: string): Promise<any> {
    cpfCnpj = cpfCnpj.replace(/[^\d]+/g, '');
    const query: string = `
    SELECT
    entidade_cliente.documento AS cpf_cnpj_cliente,
    entidade_cliente.nome AS nome_cliente,
    origem.cep,
    cidades_origem.nome as cidade,
    bairros_origem.nome as bairro,
    ufs_origem.sigla as uf,
    origem.logradouro,
    origem.numero,
    origem.complemento,
    coletas.valor_nf,
    coletas.chave_nf,
    produtos.descricao_produto,
    entidade_embarcador.documento AS cnpj_cpf_embarcador,
    entidade_embarcador.nome AS nome_embarcador,
    ufs_destino.sigla,
    cidades_destino.nome
    FROM coletas
    JOIN clientes ON coletas.cliente_id = clientes.id
    JOIN entidades as entidade_cliente ON clientes.entidade_id = entidade_cliente.id
    JOIN enderecos as origem ON coletas.end_origem_id = origem.id
    JOIN bairros as bairros_origem ON origem.bairro_id = bairros_origem.id
    JOIN cidades as cidades_origem ON bairros_origem.cidade_id = cidades_origem.id
    JOIN ufs as ufs_origem ON cidades_origem.uf_id = ufs_origem.id
    JOIN embarcadores ON coletas.embarcador_id = embarcadores.id
    JOIN entidades as entidade_embarcador ON embarcadores.entidade_id = entidade_embarcador.id
    JOIN enderecos as destino ON coletas.end_destino_id = destino.id
    JOIN bairros as bairros_destino ON destino.bairro_id = bairros_destino.id
    JOIN cidades as cidades_destino ON bairros_destino.cidade_id = cidades_destino.id
    JOIN ufs as ufs_destino ON cidades_destino.uf_id = ufs_destino.id
    JOIN coleta_produtos ON coleta_produtos.nf_id = coletas.id
    JOIN produtos ON produtos.cod_produto = coleta_produtos.cod_produto
    WHERE entidade_cliente.documento = ${cpfCnpj}
    ORDER BY coletas.created_at DESC
    LIMIT 1`

    const resultado = await this.executaQuery(query, [cpfCnpj])
    return resultado
  }

  public async consultaPorTelefone(telefone: string): Promise<any> {
    telefone = telefone.slice(2); // Remove o prefixo (por exemplo, '55')
    const query: string = `
    SELECT
    entidade_cliente.documento AS cpf_cnpj_cliente,
    entidade_cliente.nome AS nome_cliente,
    origem.cep,
    cidades_origem.nome as cidade,
    bairros_origem.nome as bairro,
    ufs_origem.sigla as uf,
    origem.logradouro,
    origem.numero,
    origem.complemento,
    coletas.valor_nf,
    coletas.chave_nf,
    produtos.descricao_produto,
    entidade_embarcador.documento AS cnpj_cpf_embarcador,
    entidade_embarcador.nome AS nome_embarcador,
    ufs_destino.sigla,
    cidades_destino.nome
    FROM coletas
    JOIN clientes ON coletas.cliente_id = clientes.id
    JOIN entidades as entidade_cliente ON clientes.entidade_id = entidade_cliente.id
    JOIN contatos as contatos_cliente ON entidade_cliente.documento = contatos_cliente.cpf_cnpj
    JOIN enderecos as origem ON coletas.end_origem_id = origem.id
    JOIN bairros as bairros_origem ON origem.bairro_id = bairros_origem.id
    JOIN cidades as cidades_origem ON bairros_origem.cidade_id = cidades_origem.id
    JOIN ufs as ufs_origem ON cidades_origem.uf_id = ufs_origem.id
    JOIN embarcadores ON coletas.embarcador_id = embarcadores.id
    JOIN entidades as entidade_embarcador ON embarcadores.entidade_id = entidade_embarcador.id
    JOIN enderecos as destino ON coletas.end_destino_id = destino.id
    JOIN bairros as bairros_destino ON destino.bairro_id = bairros_destino.id
    JOIN cidades as cidades_destino ON bairros_destino.cidade_id = cidades_destino.id
    JOIN ufs as ufs_destino ON cidades_destino.uf_id = ufs_destino.id
    JOIN coleta_produtos ON coleta_produtos.nf_id = coletas.id
    JOIN produtos ON produtos.cod_produto = coleta_produtos.cod_produto
    WHERE contatos_cliente.telefone = ${telefone}
    OR contatos_cliente.telefone2 = ${telefone}`;

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
