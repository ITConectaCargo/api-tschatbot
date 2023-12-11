import MinutaModel from '@models/MinutaModel'
import { Document } from 'mongoose';

export default class CriarMinutaServices {
  public async executar(minutaData: string) {
    const novaMinuta = new MinutaModel({
      minuta: minutaData
    });
    const savedMinuta = await novaMinuta.save();

    return savedMinuta;
  }
}
