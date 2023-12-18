import EmbarcadorModel from "@models/EmbarcadorModel";
import { Mensagem } from "@models/MensagemModel";
import { Minuta } from "@models/MinutaModel";
import { Protocolo } from "@models/ProtocoloModel";
import ConsultaContatoService from "@services/contatos/ConsultaContatoService";
import ConsultaMensagemTemplateService from "@services/mensagemTemplate/ConsultaMensagemService";
import ConsultaMensagemService from "@services/mensagens/ConsultaMensagemService";
import CriarMensagemService from "@services/mensagens/CriarMensagemService";
import ConsultaMinutaService from "@services/minutas/ConsultaMinutaService";
import AtualizarProtocoloService from "@services/protocolo/AtualizarProtocoloService";
import EnviaMensagensMetaService from "@services/whatsapp/EnviaMensagensMetaService";
import moment from "moment";

export default class UraAtivoService {
  public async preparaUra(protocolo: Protocolo, ultimaMensagem: Mensagem) {
    if (protocolo.minuta) {
      const consultaMinuta = new ConsultaMinutaService()
      const minuta = await consultaMinuta.porId(protocolo.minuta, true)
      await this.uraConvencional(protocolo, ultimaMensagem, minuta)
    }
  }

  private async uraConvencional(protocolo: Protocolo, ultimaMensagem: Mensagem, minuta: Minuta): Promise<void> {
    const consultaContato = new ConsultaContatoService()
    const contatoBot = await consultaContato.contatoAdm()

    if (protocolo.estagioBot === 'inicio' && (minuta.embarcador instanceof EmbarcadorModel)) {
      const mensagemTemplate = new ConsultaMensagemTemplateService('ura-ativo-inicio')
      const template = await mensagemTemplate.buscar()
      const texto = template.replace("{{1}}", protocolo.de.nome)
        .replace("{{2}}", minuta.descricaoProduto || 'Produto Não Cadastrado')
        .replace("{{3}}", minuta.embarcador.nome)
        .replace("{{4}}", protocolo.de.endereco.rua)
        .replace("{{5}}", protocolo.de.endereco.numero || "⠀")
        .replace("{{6}}", protocolo.de.endereco.bairro)
        .replace("{{7}}", protocolo.de.endereco.cidade)
        .replace("{{8}}", protocolo.de.endereco.estado)
        .replace("{{9}}", protocolo.de.endereco.cep)
        .replace("{{10}}", minuta.checklist?.motivo || "Sem informação")
        .replace("{{11}}", minuta.checklist?.detalhes || "Sem informação")
        .replace("{{12}}", moment(minuta.dataAgendamento).format('DD/MM/yyyy'))

      const criarMensagem = new CriarMensagemService()
      const botMensagem = await criarMensagem.executar({
        protocolo: protocolo.protocolo,
        remetente: contatoBot._id,
        destinatario: protocolo.de.telefone,
        tipo: 'template',
        texto: texto,
        status: 'pendent',
        modelo: 'agenda_devolucao',
        parametros: {
          protocolo: protocolo,
          minuta: minuta
        }
      })

      protocolo.estagioBot = 'ura-ativo-confirmando-agendamento'
      const atualizaProtocolo = new AtualizarProtocoloService()
      await atualizaProtocolo.executar(protocolo)
      const enviaMensagensMeta = new EnviaMensagensMetaService(botMensagem)
      await enviaMensagensMeta.TemplateAgendaDevolucao(protocolo, minuta, minuta.embarcador)
    }
  }
}
