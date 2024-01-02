import { Mensagem } from "@models/MensagemModel"
import { Protocolo } from "@models/ProtocoloModel"
import ConsultaContatoService from "@services/contatos/ConsultaContatoService"
import ConsultaMensagemTemplateService from "@services/mensagemTemplate/ConsultaMensagemService"
import CriarMensagemService from "@services/mensagens/CriarMensagemService"
import AtualizarProtocoloService from "@services/protocolo/AtualizarProtocoloService"
import EnviaMensagensMetaService from "@services/whatsapp/EnviaMensagensMetaService"

export default class UraReceptivoService {
  public async uraConvencional(protocolo: Protocolo, ultimaMensagem: Mensagem) {
    const consultaContato = new ConsultaContatoService()
    const criarMensagem = new CriarMensagemService()
    const atualizaProtocolo = new AtualizarProtocoloService()

    const contatoBot = await consultaContato.contatoAdm()

    if (protocolo.estagioBot === 'inicio') {
      const mensagemTemplate = new ConsultaMensagemTemplateService('ura-receptivo-inicio')
      const template = await mensagemTemplate.buscar()

      const botMensagem = await criarMensagem.executar({
        protocolo: protocolo.protocolo,
        remetente: contatoBot._id,
        destinatario: protocolo.de.telefone,
        tipo: 'button',
        texto: template,
        status: 'pendent',
        modelo: ''
      })

      const parametros = {
        opcoes: [
          "Falar com atendente",
          "Encerrar Conversa"
        ]
      }

      protocolo.estagioBot = 'ura-receptivo-direciona-cliente'
      await atualizaProtocolo.executar(protocolo)
      const enviaMensagensMeta = new EnviaMensagensMetaService(botMensagem)
      await enviaMensagensMeta.Opcoes(parametros)
    }

    else if (protocolo.estagioBot === 'ura-receptivo-direciona-cliente') {
      if (ultimaMensagem.texto === 'Falar com atendente' || ultimaMensagem.texto === '1') {
        const mensagemTemplate = new ConsultaMensagemTemplateService('ura-falar-com-atendente')
        const template = await mensagemTemplate.buscar()
        const botMensagem = await criarMensagem.executar({
          protocolo: protocolo.protocolo,
          remetente: contatoBot._id,
          destinatario: protocolo.de.telefone,
          tipo: 'text',
          texto: template,
          status: 'pendent',
          modelo: ''
        })

        protocolo.estagioBot = 'inicio'
        protocolo.status = 'espera'
        await atualizaProtocolo.executar(protocolo)
        const enviaMensagensMeta = new EnviaMensagensMetaService(botMensagem)
        await enviaMensagensMeta.Texto()
      }
      else if (ultimaMensagem.texto === 'Encerrar Conversa' || ultimaMensagem.texto === '2') {
        const mensagemTemplate = new ConsultaMensagemTemplateService('ura-finalizar-atendimento')
        const template = await mensagemTemplate.buscar()
        const texto = template.replace('{{1}}', protocolo.protocolo)

        const botMensagem = await criarMensagem.executar({
          protocolo: protocolo.protocolo,
          remetente: contatoBot._id,
          destinatario: protocolo.de.telefone,
          tipo: 'text',
          texto: texto,
          status: 'pendent',
          modelo: ''
        })

        protocolo.estagioBot = 'inicio'
        protocolo.status = 'finalizado'
        await atualizaProtocolo.executar(protocolo)
        const enviaMensagensMeta = new EnviaMensagensMetaService(botMensagem)
        await enviaMensagensMeta.Texto()
      }
      else {
        const mensagemTemplate = new ConsultaMensagemTemplateService('ura-nao-entendi')
        const template = await mensagemTemplate.buscar()
        const botMensagem = await criarMensagem.executar({
          protocolo: protocolo.protocolo,
          remetente: contatoBot._id,
          destinatario: protocolo.de.telefone,
          tipo: 'text',
          texto: template,
          status: 'pendent',
          modelo: ''
        })
        const enviaMensagensMeta = new EnviaMensagensMetaService(botMensagem)
        await enviaMensagensMeta.Texto()

        setTimeout(async () => {
          const mensagemTemplate = new ConsultaMensagemTemplateService('ura-receptivo-inicio')
          const templateReenvio = await mensagemTemplate.buscar()
          const botMensagem = await criarMensagem.executar({
            protocolo: protocolo.protocolo,
            remetente: contatoBot._id,
            destinatario: protocolo.de.telefone,
            tipo: 'button',
            texto: templateReenvio,
            status: 'pendent',
            modelo: ''
          })

          const parametros = {
            opcoes: [
              "Falar com atendente",
              "Encerrar Conversa"
            ]
          }

          protocolo.estagioBot = 'ura-receptivo-direciona-cliente'
          await atualizaProtocolo.executar(protocolo)
          const enviaMensagensMeta = new EnviaMensagensMetaService(botMensagem)
          await enviaMensagensMeta.Opcoes(parametros)
        }, 1000);
      }
    }
  }
}
