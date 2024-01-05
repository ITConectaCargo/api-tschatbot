import MinutaModel from '@models/MinutaModel';
import ConsultaMinutaService from './ConsultaMinutaService';
import Esl from '@utils/Esl';
import Checklist from '@utils/Checklist';
import { Minuta } from '@Interfaces/IMinuta';

export default class CriarMinutaServices {
  public async executar(
    minutaData: string,
    chaveNfe: string,
  ): Promise<Minuta | null> {
    try {
      const consultaMinuta = new ConsultaMinutaService();
      const minutaExiste = await consultaMinuta.porMinutaHoje(minutaData);
      if (minutaExiste) return minutaExiste;

      const checklist = new Checklist();
      const checklistDados = await checklist.consultar(chaveNfe);

      const esl = new Esl();
      const dadosOcorrencia = await esl.consultarOcorrencia(chaveNfe);
      const novaMinuta = new MinutaModel({
        minuta: minutaData,
        chaveNfe: chaveNfe,
        codigoOcorrencia: dadosOcorrencia.codigoOcorrencia || '',
        descricaoOcorrencia: dadosOcorrencia.descricaoOcorrencia || '',
        checklist: {
          motivo: checklistDados.motivo,
          detalhes: checklistDados.detalhes,
        },
      });
      const minutaSalva = await novaMinuta.save();

      return minutaSalva;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
