import MinutaModel, { Minuta } from '@models/MinutaModel'
import ConsultaMinutaService from './ConsultaMinutaService';

export default class CriarMinutaServices {
  public async executar(minutaData: string, chaveNfe: string): Promise<Minuta> {
    const consultaMinuta = new ConsultaMinutaService()

    const minutaExiste = await consultaMinuta.porMinutaHoje(minutaData)



    if(!minutaExiste) {
      const novaMinuta = new MinutaModel({
        minuta: minutaData,
        chaveNfe: chaveNfe
      });
      const minutaSalva = await novaMinuta.save();
      return minutaSalva
    }
    return minutaExiste
  }
}
