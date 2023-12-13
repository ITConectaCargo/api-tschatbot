import MinutaModel, { Minuta } from "@models/MinutaModel";
import moment from "moment";

export default class ConsultaMinutaService {
  public async porMinutaHoje(numeroMinuta: string): Promise<Minuta | null> {
    const hoje = moment().startOf('day');

    const minuta = await MinutaModel.findOne({
      minuta: numeroMinuta,
    }).sort({ criadoEm: -1 });

    if (minuta) {
      const dataCriacao = moment(minuta.criadoEm).startOf('day');
      if (hoje.isSame(dataCriacao)) {
        return minuta;
      }
    }
    return null
  }


  public async porId(id: string): Promise<Minuta | null> {
    const minuta = await MinutaModel.findById(id);
    return minuta;
  }
}
