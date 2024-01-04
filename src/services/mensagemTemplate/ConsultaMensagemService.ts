import MensagemTemplateModel from '@models/MensagemTemplateModel';
import AppError from '@utils/AppError';

export default class ConsultaMensagemTemplateService {
  private modelo: string;

  constructor(modelo: string) {
    this.modelo = modelo;
  }

  public async buscar(): Promise<string> {
    const mensagemTemplate = await MensagemTemplateModel.findOne({
      modelo: this.modelo,
    });

    if (!mensagemTemplate) {
      throw new AppError('Mensagem Template nao encontrada');
    }

    return mensagemTemplate.texto;
  }
}
