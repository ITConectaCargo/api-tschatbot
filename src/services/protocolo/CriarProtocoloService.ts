import ProtocoloModel, { Protocolo } from '@models/ProtocoloModel';
import ConsultaContatoService from '@services/contatos/ConsultaContatoService';
import ConsultaMinutaService from '@services/minutas/ConsultaMinutaService';
import AppError from '@utils/AppError';
import { Types } from 'mongoose';

interface ProtocoloParams {
  remetenteId: Types.ObjectId;
  remetenteNumero: string;
  destinatarioNumero: string;
  origem: string;
  numeroMinuta?: string;
  sensivel?: boolean;
}

export default class CriarProtocoloService {
  public async executar({
    remetenteId,
    remetenteNumero,
    destinatarioNumero,
    origem,
    numeroMinuta = '',
    sensivel = false,
  }: ProtocoloParams): Promise<Protocolo> {
    const consultaContato = new ConsultaContatoService();
    const consultaMinuta = new ConsultaMinutaService();

    const protocolo = await this.gerarNumeroProtocolo(remetenteNumero);
    const contato = await consultaContato.porId(remetenteId);
    const minuta = await consultaMinuta.porMinutaHoje(numeroMinuta);

    if (!contato) {
      throw new AppError('Contato nao encontrado para criar um protocolo');
    }

    const novoProtocolo = new ProtocoloModel({
      protocolo,
      de: {
        _id: contato._id,
        nome: contato.nome,
        telefone: remetenteNumero,
        cpfCnpj: contato.cpfCnpj || '',
        endereco: {
          rua: contato.endereco?.rua || '',
          numero: contato.endereco?.numero || '',
          bairro: contato.endereco?.bairro || '',
          cidade: contato.endereco?.cidade || '',
          estado: contato.endereco?.estado || '',
          cep: contato.endereco?.cep || '',
          complemento: contato.endereco?.complemento || '',
        },
      },
      para: destinatarioNumero,
      status: 'ura',
      estagioBot: 'inicio',
      origem: origem,
      minuta: minuta?._id || null,
      sensivel: sensivel,
    });

    const protocoloSalvo = await novoProtocolo.save();

    if (!protocoloSalvo) {
      throw new AppError('Erro ao criar protocolo');
    }

    return protocoloSalvo;
  }

  private async gerarNumeroProtocolo(telefone: string): Promise<string> {
    const padZero = (valor: number | string, tamanho: number = 2): string =>
      String(valor).padStart(tamanho, '0');

    const data = new Date();
    const ano = data.getFullYear();
    const hora = padZero(data.getHours());
    const minuto = padZero(data.getMinutes());
    const milisegundos = padZero(data.getMilliseconds());
    const tel = telefone.substr(9, 13);

    return `${ano}${tel}${hora}${minuto}${milisegundos}`;
  }
}
