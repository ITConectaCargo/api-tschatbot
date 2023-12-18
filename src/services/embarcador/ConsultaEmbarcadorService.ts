import EmbarcadorModel, { Embarcador } from "@models/EmbarcadorModel";

export default class ConsultaEmbarcadorService {
  public async porCpfCnpj(cpfCnpj: string): Promise<Embarcador | null> {
    const embarcador = await EmbarcadorModel.findOne({ cpfCnpj: cpfCnpj })

    if (embarcador) return embarcador

    return null
  }
}
