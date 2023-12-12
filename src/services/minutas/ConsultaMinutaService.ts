import MinutaModel, { Minuta } from "@models/MinutaModel";
import moment from "moment";

export default class ConsultaMinutaService {
  public async porMinutaHoje(numeroMinuta: string): Promise<Minuta | null> {
    const hoje = moment();

    const inicioDoDia = hoje.startOf('day');
    const finalDoDia = hoje.endOf('day');

    const minuta = await MinutaModel.findOne({
      dataMinuta: {
        $gte: inicioDoDia.toDate(),
        $lte: finalDoDia.toDate(),
      },
    })

    return minuta;
  }

  public async porId(id: string): Promise<Minuta | null> {
    const minuta = await MinutaModel.findById(id);
    return minuta;
  }
}
