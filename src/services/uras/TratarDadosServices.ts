import { Contato } from "@models/ContatoModel";
import ConsultaContatoService from "@services/contatos/ConsultaContatoService";
import AtualizaProtocoloService from "@services/protocolo/AtualizaProtocoloService";
import ConsultaProtocoloService from "@services/protocolo/ConsultaProtocoloService";
import PortalColeta from "@utils/PortalColeta";
import { Moment } from "moment";

interface Mensagem {
  nome: string,
  telefone: string,
  para: string,
  phoneId: string,
  timestamp: number,
  texto: string,
  dataAgendamento: Moment,
  minuta: string,
  chaveNfe: string,
  ocorrencia: string,
  sensivel: string
}

export default class TratarDadosService {
  public async ativo(mensagem: Mensagem, destinatario: Contato): Promise<void> {
    const consultaProtocolo = new ConsultaProtocoloService()
    const atualizaProtocolo = new AtualizaProtocoloService()
    const portalColeta = new PortalColeta()

    let protocolo = await consultaProtocolo.porContatoId(destinatario._id)

    if (protocolo && protocolo.status !== "finalizado") {
      if (mensagem.telefone == protocolo.de.telefone) {
        protocolo.status = 'finalizado'
        await atualizaProtocolo.executar(protocolo._id, protocolo.status, 'inicio')
      }
    }

    let dadosSql = await portalColeta.consultaPorTelefone(mensagem.telefone)



  }
}
