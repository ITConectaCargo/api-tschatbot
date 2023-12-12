import ContatoModel, { Contato } from "@models/ContatoModel";

export default class ConsultaContatoService {
  public async porCpfCnpj(cpfCnpj: string): Promise<Contato | null> {
    const contato = await ContatoModel.findOne({ cpfCnpj });
    if(contato?.estaAtivo){
      return contato;
    }
    return null
  }

  public async porId(id: string): Promise<Contato | null> {
    const contato = await ContatoModel.findById(id);
    if(contato?.estaAtivo){
      return contato;
    }
    return null
  }

  public async contatoAdm(): Promise<Contato | null> {
    const contato = await ContatoModel.findOne({ admin: true });
    if(contato?.estaAtivo){
      return contato;
    }
    return null
  }
}
