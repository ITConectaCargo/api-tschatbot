import { Contato } from "@models/ContatoModel";
import CriarEmbarcadorService from "@services/embarcador/CriarEmbarcadorService";
import CriarMensagemService from "@services/mensagens/CriarMensagemService";
import AtualizarMinutaService from "@services/minutas/AtualizarMinutaServices";
import ConsultaMinutaService from "@services/minutas/ConsultaMinutaService";
import AtualizaProtocoloService from "@services/protocolo/AtualizarProtocoloService";
import ConsultaProtocoloService from "@services/protocolo/ConsultaProtocoloService";
import CriarProtocoloService from "@services/protocolo/CriarProtocoloService";
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
    const criaProtocolo = new CriarProtocoloService()
    const consultaProtocolo = new ConsultaProtocoloService()
    const atualizaProtocolo = new AtualizaProtocoloService()
    const criarEmbarcador = new CriarEmbarcadorService()
    const consultaMinuta = new ConsultaMinutaService()
    const atualizarMinuta = new AtualizarMinutaService()
    const criarMensagem = new CriarMensagemService()
    const portalColeta = new PortalColeta()

    let minuta = await consultaMinuta.porMinutaHoje(mensagem.minuta)
    let protocolo = await consultaProtocolo.porContatoId(destinatario._id)

    if (protocolo && protocolo.status !== "finalizado") {
      if (mensagem.telefone == protocolo.de.telefone) {
        protocolo.status = 'finalizado'
        await atualizaProtocolo.executar(protocolo._id, protocolo.status, 'inicio')
      }
    }

    let dadosSql = await portalColeta.consultaPorTelefone(mensagem.telefone)

    if (dadosSql.length === 0 && destinatario.cpfCnpj) {
      dadosSql = await portalColeta.consultaPorCpfCnpj(destinatario.cpfCnpj)
    }

    if(dadosSql.length > 0 && minuta) {
      console.log(`Encontrado do SQL ${dadosSql.length}`)
      for (const frete of dadosSql){
        if(frete.chaveNfe === minuta.chaveNfe){
          console.log('Encontrei ChaveNfe')
          const embarcador = await criarEmbarcador.executar(frete.cnpjCpf, frete.nomeMkt)

          minuta.embarcador = embarcador._id
          minuta.descricaoProduto = frete.descricaoProduto
          minuta.dataAgendamento = mensagem.dataAgendamento
          const novaMinuta = await atualizarMinuta.porId(minuta)
          minuta = novaMinuta
        }
      }
    }

    const novoProtocolo = await criaProtocolo.executar({
      destinatarioId: destinatario._id,
      destinatarioNumero: mensagem.telefone,
      origem: 'ativo',
      numeroMinuta: mensagem.minuta
    })

    if(minuta && novoProtocolo) {
      minuta.protocolo = [novoProtocolo.protocolo]
      await atualizarMinuta.porId(minuta)

      await criarMensagem.executar({
        protocolo: novoProtocolo.protocolo,
        remetente: destinatario._id,
        destinatario: mensagem.para,
        tipo: 'text',
        texto: mensagem.texto,
        status: 'pendent',
        idTelefone: mensagem.phoneId,
        timestamp: mensagem.timestamp,
      })

    }
  }
}
