import MinutaModel from '@models/MinutaModel'

export default class CriarMinutaServices {
  public async executar(minutaData: string) {
    const novaMinuta = new MinutaModel({
      minuta: minutaData
    });
    const minutaSalva = await novaMinuta.save();

    return minutaSalva;
  }
}
