import { Embarcador } from "@models/EmbarcadorModel";
import MinutaModel, { Minuta } from "@models/MinutaModel";
import AppError from "@utils/AppError";
import moment from "moment";
import { Types } from "mongoose";

export default class ConsultaMinutaService {
  public async porMinutaHoje(numeroMinuta: string): Promise<Minuta | null> {
    const hoje = moment().startOf('day');

    const minuta = await MinutaModel.findOne({
      minuta: numeroMinuta,
    }).sort({ criadoEm: -1 })
      .populate('embarcador')
      .exec()

    if (!minuta) {
      return null
    }

    const dataCriacao = moment(minuta.criadoEm).startOf('day');
    if (hoje.isSame(dataCriacao)) {
      return minuta;
    }
    else {
      return null
    }
  }

  public async porId(id: Types.ObjectId, populaEmbarcador: boolean = false): Promise<Minuta> {
    const minuta = await MinutaModel.findById(id).populate('embarcador').exec()
    if (!minuta) throw new AppError('Minuta nao ncontrada')
    return minuta;
  }
}
