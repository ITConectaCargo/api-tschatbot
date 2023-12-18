import dotenv from 'dotenv'
import moment from 'moment';
import AppError from './AppError';
dotenv.config()

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
}
