import ContatoModel from "@models/ContatoModel";

export default class ConsultaContatoService {
  public async porCpfCnpj(cpfCnpj: string) {
    const contato = await ContatoModel.findOne({ cpfCnpj });
    return contato;
  }
}
