import EmbarcadorModel from '@models/EmbarcadorModel';
import ConsultaEmbarcadorService from './ConsultaEmbarcadorService';
import { Embarcador } from '@Interfaces/IEmbarcador';

export default class CriarEmbarcadorService {
  public async executar(cpfCnpj: string, nome: string): Promise<Embarcador> {
    const consultaEmbarcador = new ConsultaEmbarcadorService();

    const existeEmbarcador = await consultaEmbarcador.porCpfCnpj(cpfCnpj);

    if (existeEmbarcador) return existeEmbarcador;

    const novoEmbarcador = new EmbarcadorModel({
      cpfCnpj,
      nome,
    });

    const embarcadorSalvo = await novoEmbarcador.save();
    return embarcadorSalvo;
  }
}
