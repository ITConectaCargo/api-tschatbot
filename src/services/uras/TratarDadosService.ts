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
import UraAtivoService from "./UraAtivoService";
import CriarContatoService from "@services/contatos/CriarContatoService";
import UraReceptivoService from "./UraReceptivoServices";
import ConsultaContatoService from "@services/contatos/ConsultaContatoService";

interface MensagemAtivo {
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

interface MensagemReceptivo {
  nome: string,
  telefone: string,
  para: string,
  status: string,
  telefoneId: string,
  mensagemId: string,
  timestamp: number,
  tipo: string
  texto: string,
}

export default class TratarDadosService {
  public async ativo(mensagem: MensagemAtivo, destinatario: Contato): Promise<void> {
    const consultaMinuta = new ConsultaMinutaService()
    let minuta = await consultaMinuta.porMinutaHoje(mensagem.minuta)

    const consultaProtocolo = new ConsultaProtocoloService()
    let protocolo = await consultaProtocolo.porContatoId(destinatario._id)

    if (protocolo && protocolo.status !== "finalizado") {
      if (mensagem.telefone == protocolo.de.telefone) {
        protocolo.status = 'finalizado'
        protocolo.estagioBot = 'inicio'
        const atualizaProtocolo = new AtualizaProtocoloService()
        await atualizaProtocolo.executar(protocolo)
      }
    }

    if (minuta) {
      const portalColeta = new PortalColeta()
      const [embarcadorSql] = await portalColeta.consultaEmbarcador(minuta.chaveNfe)

      const criarEmbarcador = new CriarEmbarcadorService()
      const embarcador = await criarEmbarcador.executar(embarcadorSql.documento, embarcadorSql.nome)

      const produtoSql = await portalColeta.consultaProduto(minuta.chaveNfe)

      minuta.embarcador = embarcador._id
      minuta.descricaoProduto = produtoSql
      minuta.dataAgendamento = mensagem.dataAgendamento
      const atualizarMinuta = new AtualizarMinutaService()
      const novaMinuta = await atualizarMinuta.porId(minuta)
      minuta = novaMinuta
    }

    const consultaContato = new ConsultaContatoService()
    const contatoAdm = await consultaContato.contatoAdm()

    const criaProtocolo = new CriarProtocoloService()
    const novoProtocolo = await criaProtocolo.executar({
      remetenteId: destinatario._id,
      remetenteNumero: mensagem.telefone,
      destinatarioNumero: contatoAdm.telefone,
      origem: 'ativo',
      numeroMinuta: mensagem.minuta
    })

    if (minuta && novoProtocolo) {
      minuta.protocolo = [novoProtocolo.protocolo]
      const atualizarMinuta = new AtualizarMinutaService()
      await atualizarMinuta.porId(minuta)

      const criarMensagem = new CriarMensagemService()
      const novaMensagem = await criarMensagem.executar({
        protocolo: novoProtocolo.protocolo,
        remetente: destinatario._id,
        destinatario: mensagem.para,
        tipo: 'text',
        texto: mensagem.texto,
        status: 'delivered',
      })

      const uraAtivo = new UraAtivoService()
      await uraAtivo.preparaUra(novoProtocolo, novaMensagem)
    }
  }

  public async receptivo(mensagem: MensagemReceptivo): Promise<void> {
    const consultaProtocolo = new ConsultaProtocoloService()
    const criaContato = new CriarContatoService()
    const criaProtocolo = new CriarProtocoloService()
    const criarMensagem = new CriarMensagemService()
    const uraReceptivo = new UraReceptivoService()
    const uraAtivo = new UraAtivoService()

    const protocolo = await consultaProtocolo.porTelefone(mensagem.telefone)

    if (!protocolo) {
      const novoContato = await criaContato.executar({
        nome: mensagem.nome,
        telefone: mensagem.telefone,
      })
      const novoProtocolo = await criaProtocolo.executar({
        remetenteId: novoContato._id,
        remetenteNumero: mensagem.telefone,
        destinatarioNumero: mensagem.para,
        origem: 'receptivo'
      })
      const novaMensagem = await criarMensagem.executar({
        protocolo: novoProtocolo.protocolo,
        remetente: novoContato._id,
        destinatario: mensagem.para,
        tipo: mensagem.tipo,
        texto: mensagem.texto,
        idMensagem: mensagem.mensagemId,
        status: mensagem.status,
      })

      await uraReceptivo.uraConvencional(novoProtocolo, novaMensagem)
    } else if (protocolo.status === 'finalizado') {
      const novoProtocolo = await criaProtocolo.executar({
        remetenteId: protocolo.de._id,
        remetenteNumero: mensagem.telefone,
        destinatarioNumero: mensagem.para,
        origem: 'receptivo'
      })
      const novaMensagem = await criarMensagem.executar({
        protocolo: novoProtocolo.protocolo,
        remetente: protocolo.de._id,
        destinatario: mensagem.para,
        tipo: mensagem.tipo,
        texto: mensagem.texto,
        idMensagem: mensagem.mensagemId,
        status: mensagem.status,
      })

      await uraReceptivo.uraConvencional(novoProtocolo, novaMensagem)
    }
    else {
      const novaMensagem = await criarMensagem.executar({
        protocolo: protocolo.protocolo,
        remetente: protocolo.de._id,
        destinatario: mensagem.para,
        tipo: mensagem.tipo,
        texto: mensagem.texto,
        idMensagem: mensagem.mensagemId,
        status: mensagem.status,
      })

      if (protocolo.status === 'ura') {
        if (protocolo.origem === 'ativo') {
          await uraAtivo.preparaUra(protocolo, novaMensagem)
        }
        else {
          await uraReceptivo.uraConvencional(protocolo, novaMensagem)
        }
      }
    }
  }
}
