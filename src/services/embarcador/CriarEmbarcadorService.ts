import EmbarcadorModel, { Embarcador } from "@models/EmbarcadorModel";

export default class CriarEmbarcadorService {
  public async executar(cpfCnpj: string, nome: string): Promise<Embarcador>{
    const novoEmbarcador = new EmbarcadorModel({
      cpfCnpj,
      nome
    })

    const embarcadorSalvo = await novoEmbarcador.save()
    return embarcadorSalvo
  }
}
