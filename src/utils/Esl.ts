import moment from 'moment';
import AppError from './AppError';
import { Minuta } from '@models/MinutaModel';
import { GraphQLClient, gql } from 'graphql-request';
import AtualizarMinutaService from '@services/minutas/AtualizarMinutaServices';
import { DescricaoOcorrencias, Ocorrencia } from '@enums/Ocorrencias';
import axios from 'axios';

interface ultimaOcorrencia {
  codigoOcorrencia: number
  descricaoOcorrencia: string
}

export default class Esl {
  public async consultarOcorrencia(chaveNfe: string): Promise<ultimaOcorrencia> {
    let urlESL = `https://conecta.eslcloud.com.br/api/invoice_occurrences?invoice_key=${chaveNfe}`

    let response = await fetch(urlESL, {
      headers: {
        Authorization: `Bearer ${process.env.TOKENCONSULTAELS}`
      }
    });

    let dados: any = await response.json();
    if (dados.paging.next_id) {
      response = await fetch(urlESL + `&start=${dados.paging.next_id}`, {
        headers: {
          Authorization: `Bearer ${process.env.TOKENCONSULTAELS}`
        }
      });
      const pagina: any = await response.json()
      dados.data.push(...pagina.data)
    }

    const ocorrencias = dados.data
    let dataMaisRecente = ocorrencias[0].occurrence_at
    let objetoMaisRecente = null;

    for (const ocorrencia of ocorrencias) {
      let ocorrenciaAtual = moment(ocorrencia.occurrence_at).format('YYYY-MM-DDTHH:mm:ss');
      if (ocorrenciaAtual >= dataMaisRecente) {
        dataMaisRecente = ocorrenciaAtual;
        objetoMaisRecente = ocorrencia;
      }
    }

    if (objetoMaisRecente) {
      return {
        codigoOcorrencia: Number(objetoMaisRecente.occurrence.code),
        descricaoOcorrencia: String(objetoMaisRecente.occurrence.description)
      }
    } else {
      throw new AppError("Ocorrencias nao encontradas na ESL")
    }
  }

  public async enviaOcorrenciaComTratativa(comentario: string, ocorrencia: number, minuta: Minuta): Promise<boolean> {
    const client = new GraphQLClient('https://conecta.eslcloud.com.br/graphql', {
      headers: {
        Authorization: `Bearer ${process.env.TOKENAGENDAMENTOELS}`,
      },
    });

    const query = gql`
      mutation ReversePickFreightScheduleCreate($key: String!, $params: FreightScheduleInput!) {
        reversePickFreightScheduleCreate(key: $key, params: $params) {
          errors
          success
        }
      }
    `;

    const variaveis = {
      key: minuta.chaveNfe,
      params: {
        invoiceOccurrence: {
          occurrenceAt: moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
          occurrenceCode: ocorrencia,
          occurrenceId: null,
          comments: comentario,
        },
        ...(ocorrencia === 300 && {
          schedulingDate: moment(minuta.dataAgendamento).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
          schedulingPeriod: 'all',
        }),
      },
    };

    try {
      interface ResultType {
        reversePickFreightScheduleCreate: {
          errors: string[];
          success: boolean;
        };
      }

      const data: ResultType = await client.request(query, variaveis);

      const result = data.reversePickFreightScheduleCreate;

      if (result.success) {
        console.log(result.success);

        minuta.codigoOcorrencia = ocorrencia
        minuta.descricaoOcorrencia = DescricaoOcorrencias[ocorrencia as Ocorrencia]
        const atualizarMinuta = new AtualizarMinutaService()
        await atualizarMinuta.porId(minuta)
        return true
      } else {
        console.log('Erro ao enviar ocorrência para ESL');
        console.log(result.errors[0]);
        return false
      }
    } catch (error) {
      console.error(error);
      return false
    }
  }

  public async enviaOcorrencia(comentario: string, ocorrencia: number, chaveNfe: string): Promise<boolean> {
    try {
      const resposta = await axios.post(
        'https://conecta.eslcloud.com.br/api/invoice_occurrences',
        {
          "invoice_occurrence": {
            "receiver": "",
            "document_number": "",
            "comments": comentario,
            "occurrence_at": moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
            "occurrence": {
              "code": ocorrencia
            },
            "invoice": {
              "key": chaveNfe
            }
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.TOKENCONSULTAELS}`
          }
        }
      );

      console.log(`Ocorrência: ${ocorrencia} enviada com sucesso`);
      console.log(resposta.data);

      return true;
    } catch (error: any) {
      console.log(`Erro ao enviar ocorrência: ${ocorrencia}`);
      console.log(error.message);

      return false;
    }
  }
}
