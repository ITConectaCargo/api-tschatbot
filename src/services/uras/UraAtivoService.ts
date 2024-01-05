import { Mensagem } from '@Interfaces/IMensagem';
import { Minuta } from '@Interfaces/IMinuta';
import { Protocolo } from '@Interfaces/IProtocolo';
import EmbarcadorModel from '@models/EmbarcadorModel';
import ConsultaContatoService from '@services/contatos/ConsultaContatoService';
import ConsultaMensagemTemplateService from '@services/mensagemTemplate/ConsultaMensagemService';
import CriarMensagemService from '@services/mensagens/CriarMensagemService';
import TranscricaoConversaService from '@services/mensagens/TranscricaoConversaService';
import ConsultaMinutaService from '@services/minutas/ConsultaMinutaService';
import AtualizarProtocoloService from '@services/protocolo/AtualizarProtocoloService';
import EnviaMensagensMetaService from '@services/whatsapp/EnviaMensagensMetaService';
import AppError from '@utils/AppError';
import Esl from '@utils/Esl';
import moment from 'moment';

export default class UraAtivoService {
  public async preparaUra(protocolo: Protocolo, ultimaMensagem: Mensagem) {
    if (protocolo.minuta) {
      const consultaMinuta = new ConsultaMinutaService();
      const minuta = await consultaMinuta.porId(protocolo.minuta, true);
      await this.uraConvencional(protocolo, ultimaMensagem, minuta);
    } else {
      throw new AppError('Protocolo sem minuta para envio de Ativo');
    }
  }

  private async uraConvencional(
    protocolo: Protocolo,
    ultimaMensagem: Mensagem,
    minuta: Minuta,
  ): Promise<void> {
    const consultaContato = new ConsultaContatoService();
    const contatoBot = await consultaContato.contatoAdm();

    if (
      protocolo.estagioBot === 'inicio' &&
      minuta.embarcador instanceof EmbarcadorModel
    ) {
      const mensagemTemplate = new ConsultaMensagemTemplateService(
        'ura-ativo-inicio',
      );
      const template = await mensagemTemplate.buscar();
      const texto = template
        .replace('{{1}}', protocolo.de.nome)
        .replace('{{2}}', minuta.descricaoProduto || 'Produto Não Cadastrado')
        .replace('{{3}}', minuta.embarcador.nome)
        .replace('{{4}}', protocolo.de.endereco.rua)
        .replace('{{5}}', protocolo.de.endereco.numero || '⠀')
        .replace('{{6}}', protocolo.de.endereco.bairro)
        .replace('{{7}}', protocolo.de.endereco.cidade)
        .replace('{{8}}', protocolo.de.endereco.estado)
        .replace('{{9}}', protocolo.de.endereco.cep)
        .replace('{{10}}', minuta.checklist?.motivo || 'Sem informação')
        .replace('{{11}}', minuta.checklist?.detalhes || 'Sem informação')
        .replace('{{12}}', moment(minuta.dataAgendamento).format('DD/MM/yyyy'));

      const criarMensagem = new CriarMensagemService();
      const botMensagem = await criarMensagem.executar({
        protocolo: protocolo.protocolo,
        remetente: contatoBot._id,
        destinatario: protocolo.de.telefone,
        tipo: 'template',
        texto: texto,
        status: 'pendent',
        modelo: 'agenda_devolucao',
      });

      protocolo.estagioBot = 'ura-ativo-confirmando-agendamento';
      const atualizaProtocolo = new AtualizarProtocoloService();
      await atualizaProtocolo.executar(protocolo);
      const enviaMensagensMeta = new EnviaMensagensMetaService(botMensagem);
      await enviaMensagensMeta.TemplateAgendaDevolucao(
        protocolo,
        minuta,
        minuta.embarcador,
      );
    } else if (protocolo.estagioBot === 'resposta-inicio') {
      if (ultimaMensagem.texto == '1' || ultimaMensagem.texto == 'Sim') {
        const mensagemTemplate = new ConsultaMensagemTemplateService(
          'ura-ativo-instrucoes',
        );
        const template = await mensagemTemplate.buscar();

        const criarMensagem = new CriarMensagemService();
        const botMensagem = await criarMensagem.executar({
          protocolo: protocolo.protocolo,
          remetente: contatoBot._id,
          destinatario: protocolo.de.telefone,
          tipo: 'text',
          texto: template,
          status: 'pendent',
        });

        const enviaMensagensMeta = new EnviaMensagensMetaService(botMensagem);
        await enviaMensagensMeta.Texto();

        setTimeout(async () => {
          console.log('ura agendamento confirmaData');
          const comentario = `Protocolo: ${protocolo.protocolo} // Por: Bot // Via ChatBot`;
          const esl = new Esl();
          const agendado = await esl.enviaOcorrenciaComTratativa(
            comentario,
            300,
            minuta,
          );

          if (agendado) {
            const mensagemTemplate = new ConsultaMensagemTemplateService(
              'ura-ativo-agendado',
            );
            const template = await mensagemTemplate.buscar();
            const texto = template
              .replace(
                '{{1}}',
                moment(minuta.dataAgendamento).format('DD/MM/yyyy'),
              )
              .replace('{{2}}', protocolo.protocolo);

            const criarMensagem = new CriarMensagemService();
            const botMensagem = await criarMensagem.executar({
              protocolo: protocolo.protocolo,
              remetente: contatoBot._id,
              destinatario: protocolo.de.telefone,
              tipo: 'text',
              texto: texto,
              status: 'pendent',
            });

            protocolo.estagioBot = 'inicio';
            protocolo.status = 'finalizado';
            const atualizaProtocolo = new AtualizarProtocoloService();
            await atualizaProtocolo.executar(protocolo);

            const enviaMensagensMeta = new EnviaMensagensMetaService(
              botMensagem,
            );
            await enviaMensagensMeta.Texto();
          } else {
            const mensagemTemplate = new ConsultaMensagemTemplateService(
              'ura-ativo-agendado-erro',
            );
            const template = await mensagemTemplate.buscar();

            const criarMensagem = new CriarMensagemService();
            const botMensagem = await criarMensagem.executar({
              protocolo: protocolo.protocolo,
              remetente: contatoBot._id,
              destinatario: protocolo.de.telefone,
              tipo: 'text',
              texto: template,
              status: 'pendent',
            });

            const enviaMensagensMeta = new EnviaMensagensMetaService(
              botMensagem,
            );
            await enviaMensagensMeta.Texto();

            setTimeout(async () => {
              const mensagemTemplate = new ConsultaMensagemTemplateService(
                'ura-falar-com-atendente',
              );
              const template = await mensagemTemplate.buscar();

              const criarMensagem = new CriarMensagemService();
              const botMensagem = await criarMensagem.executar({
                protocolo: protocolo.protocolo,
                remetente: contatoBot._id,
                destinatario: protocolo.de.telefone,
                tipo: 'text',
                texto: template,
                status: 'pendent',
              });

              protocolo.estagioBot = 'inicio';
              protocolo.status = 'espera';
              const atualizaProtocolo = new AtualizarProtocoloService();
              await atualizaProtocolo.executar(protocolo);

              const enviaMensagensMeta = new EnviaMensagensMetaService(
                botMensagem,
              );
              await enviaMensagensMeta.Texto();
            });
          }
        }, 3000);
      } else if (ultimaMensagem.texto == '2' || ultimaMensagem.texto == 'Não') {
        const mensagemTemplate = new ConsultaMensagemTemplateService(
          'ura-ativo-nao-agendar',
        );
        const template = await mensagemTemplate.buscar();

        const criarMensagem = new CriarMensagemService();
        const botMensagem = await criarMensagem.executar({
          protocolo: protocolo.protocolo,
          remetente: contatoBot._id,
          destinatario: protocolo.de.telefone,
          tipo: 'list',
          texto: template,
          status: 'pendent',
        });

        protocolo.estagioBot = 'valida-motivo';
        const atualizaProtocolo = new AtualizarProtocoloService();
        await atualizaProtocolo.executar(protocolo);

        const enviaMensagensMeta = new EnviaMensagensMetaService(botMensagem);
        await enviaMensagensMeta.Lista({
          botao: 'Motivo',
          opcoes: [
            'Não estarei em casa',
            'Produto já devolvido',
            'Produto incorreto',
            'Ficarei com o produto',
          ],
        });
      } else if (
        ultimaMensagem.texto == '3' ||
        ultimaMensagem.texto == 'Falar com Atendente'
      ) {
        const mensagemTemplate = new ConsultaMensagemTemplateService(
          'ura-falar-com-atendente',
        );
        const template = await mensagemTemplate.buscar();

        const criarMensagem = new CriarMensagemService();
        const botMensagem = await criarMensagem.executar({
          protocolo: protocolo.protocolo,
          remetente: contatoBot._id,
          destinatario: protocolo.de.telefone,
          tipo: 'text',
          texto: template,
          status: 'pendent',
        });

        protocolo.estagioBot = 'inicio';
        protocolo.status = 'espera';
        const atualizaProtocolo = new AtualizarProtocoloService();
        await atualizaProtocolo.executar(protocolo);

        const enviaMensagensMeta = new EnviaMensagensMetaService(botMensagem);
        await enviaMensagensMeta.Texto();
      }
    } else if (protocolo.estagioBot === 'valida-motivo') {
      const esl = new Esl();
      const comentario = `Protocolo: ${protocolo.protocolo} // Por: Bot // Via ChatBot`;
      if (
        ultimaMensagem.texto === '1' ||
        ultimaMensagem.texto === 'Não estarei em casa'
      ) {
        const mensagemTemplate = new ConsultaMensagemTemplateService(
          'ura-ativo-movivo-nao-estei-em-casa',
        );
        const template = await mensagemTemplate.buscar();

        const criarMensagem = new CriarMensagemService();
        const botMensagem = await criarMensagem.executar({
          protocolo: protocolo.protocolo,
          remetente: contatoBot._id,
          destinatario: protocolo.de.telefone,
          tipo: 'text',
          texto: template,
          status: 'pendent',
        });

        protocolo.estagioBot = 'inicio';
        protocolo.status = 'espera';
        const atualizaProtocolo = new AtualizarProtocoloService();
        await atualizaProtocolo.executar(protocolo);

        const enviaMensagensMeta = new EnviaMensagensMetaService(botMensagem);
        return await enviaMensagensMeta.Texto();
      } else if (
        ultimaMensagem.texto === '2' ||
        ultimaMensagem.texto === 'Produto já devolvido'
      ) {
        await esl.enviaOcorrenciaComTratativa(comentario, 304, minuta);
      } else if (
        ultimaMensagem.texto === '3' ||
        ultimaMensagem.texto === 'Produto incorreto'
      ) {
        await esl.enviaOcorrenciaComTratativa(comentario, 305, minuta);
      } else if (
        ultimaMensagem.texto === '4' ||
        ultimaMensagem.texto === 'Ficarei com o produto'
      ) {
        await esl.enviaOcorrenciaComTratativa(comentario, 306, minuta);
      }

      const transcricaoConversa = new TranscricaoConversaService(
        protocolo.protocolo,
      );
      const transcricao = await transcricaoConversa.porTexto();

      await esl.enviaOcorrencia(transcricao, 330, minuta.chaveNfe);

      const mensagemTemplate = new ConsultaMensagemTemplateService(
        'ura-ativo-motivo-finalizado',
      );
      const template = await mensagemTemplate.buscar();

      const criarMensagem = new CriarMensagemService();
      const botMensagem = await criarMensagem.executar({
        protocolo: protocolo.protocolo,
        remetente: contatoBot._id,
        destinatario: protocolo.de.telefone,
        tipo: 'text',
        texto: template,
        status: 'pendent',
      });

      protocolo.estagioBot = 'inicio';
      protocolo.status = 'finalizado';
      const atualizaProtocolo = new AtualizarProtocoloService();
      await atualizaProtocolo.executar(protocolo);

      const enviaMensagensMeta = new EnviaMensagensMetaService(botMensagem);
      await enviaMensagensMeta.Texto();
    }
  }
}
