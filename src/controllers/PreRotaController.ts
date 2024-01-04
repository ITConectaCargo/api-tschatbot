import { Request, Response } from 'express';
import fs from 'fs';
import Excel from '@utils/Excel';
import CriarArquivoPreRota from '@services/preRota/CriarArquivoPreRotaService';
import CriarMinutaServices from '@services/minutas/CriarMinutaServices';
import moment from 'moment';
import ProcessaArquivoPrerotaService from '@services/preRota/ProcessaArquivoPrerotaService';
import Email from '@utils/Email';

export default class PreRotaController {
  public async rotinaAutomatica(req: Request, res: Response): Promise<void> {
    try {
      const caminho: string = req.body.path;
      const data: string = req.body.date;
      const emails: string[] = req.body.emails;

      const dataConvertida = moment(data, 'DD/MM/yyyy');
      const dataHoje = moment();

      const verificaData: boolean = dataConvertida <= dataHoje;

      if (verificaData) {
        res
          .status(400)
          .json({ message: 'Data Precisa ser maior que a data de hoje' });
        return;
      }

      const excel = new Excel();
      const arquivoPrerota = await excel.lerDados(
        `${process.env.LOCAL!}${caminho}`,
      );

      res.status(200).json({ message: 'Enviando Mensagens' });
      console.log(
        `Rotina automatica arquivo com data ${dataConvertida.format(
          'DD/MM/yyyy',
        )}`,
      );

      const preRota = new CriarArquivoPreRota();
      const dados = await preRota.arquivoBot(arquivoPrerota, dataConvertida);

      const criarMinutas = new CriarMinutaServices();
      for (const minuta of dados.minutas) {
        await criarMinutas.executar(minuta.numero, minuta.chaveNfe);
      }

      const assunto: string = 'Planilha tratada Chatbot';
      const corpoEmail =
        'Bom dia\n\n' +
        'Segue em anexo a planilha do Takelip\n\n' +
        'Esta é uma mensagem Automatica, favor não responder';

      const anexos = [
        {
          filename: `VerificarBot-${dataConvertida.format('DD-MM-yyyy')}.xlsx`,
          content: fs.createReadStream(dados.localVerificar),
        },
        {
          filename: `EnviadosBot-${dataConvertida.format('DD-MM-yyyy')}.xlsx`,
          content: fs.createReadStream(dados.localBot),
        },
      ];

      const email = new Email();
      await email.enviarEmail({
        destinatarios: emails,
        assunto,
        corpoEmail,
        anexos,
      });
      const processaPrerota = new ProcessaArquivoPrerotaService();
      await processaPrerota.executar(dados.localBot);
    } catch (error) {
      console.log(error);
    }
  }

  // public async processaArquivoBot(req: Request, res: Response): Promise<void> {

  // }
}
