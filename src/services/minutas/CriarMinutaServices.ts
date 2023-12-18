import MinutaModel, { Minuta } from '@models/MinutaModel'
import ConsultaMinutaService from './ConsultaMinutaService';
import Esl from '@utils/Esl';
import AppError from '@utils/AppError';

export default class CriarMinutaServices {
  public async executar(minutaData: string, chaveNfe: string): Promise<Minuta> {
    const consultaMinuta = new ConsultaMinutaService()
    const esl = new Esl()

    const minutaExiste = await consultaMinuta.porMinutaHoje(minutaData)

    if (!minutaExiste) {
      const dadosOcorrencia = await esl.consultarOcorrencia(chaveNfe)
      const novaMinuta = new MinutaModel({
        minuta: minutaData,
        chaveNfe: chaveNfe,
        codigoOcorrencia: dadosOcorrencia.codigoOcorrencia || '',
        descricaoOcorrencia: dadosOcorrencia.descricaoOcorrencia || ''
      });
      const minutaSalva = await novaMinuta.save();

      if(!minutaSalva) {
        throw new AppError("minuta nao criada", 500)
      }

      return minutaSalva
    }

    return minutaExiste
  }
}
