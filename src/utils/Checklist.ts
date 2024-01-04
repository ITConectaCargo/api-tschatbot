import PortalColeta from './PortalColeta';
import Pdf from './Pdf';

interface TextoChecklist {
  motivo: string;
  detalhes: string;
}

export default class Checklist {
  public async consultar(chaveNfe: string): Promise<TextoChecklist> {
    const cnpj: string = chaveNfe.substring(6, 20);
    const raizCnpj: string = chaveNfe.substring(6, 14);

    const portalColeta = new PortalColeta();
    const [parametros] = await portalColeta.consultaUrlChecklist(raizCnpj);

    if (parametros) {
      let texto: TextoChecklist = {
        motivo: '',
        detalhes: '',
      };

      if (parametros.checkModelo == 'conecta') {
        //multilazer e mvx
        const url =
          parametros.checkUrl + `/${raizCnpj}/${cnpj}/${chaveNfe}.pdf`;

        const motivoRegex = /MOTIVO DA COLETA:(.*?)Detalhamento/gms;
        const detalhesRegex = /Detalhamento:(.*?)CAMPOS PARA VALIDAÇÃO/gms;
        texto = await this.ler(motivoRegex, detalhesRegex, url);

        const itensSelecionadosRegex = /☑\s*(.*)/g; //regex sobre o que está entre [x] e [

        const motivo = await this.processarRegex(
          itensSelecionadosRegex,
          texto.motivo,
        );
        texto.motivo = motivo;
      } else if (parametros.checkModelo == 'novo_conecta') {
        //multilazer e mvx
        const url = parametros.checkUrl + `${chaveNfe}.pdf`;

        const motivoRegex = /COLETA:\s*(.*?)Detalhamento:/gs;
        const detalhesRegex = /Detalhamento:\s*(.*?)CAMPOS/gs;
        texto = await this.ler(motivoRegex, detalhesRegex, url);
        if (
          texto.detalhes === 'CAMPOS PARA VALIDAÇÃO DO MOTORISTA OU CONFERENTE'
        )
          texto.detalhes = '';
      }

      return texto;
    } else {
      const texto: TextoChecklist = {
        motivo: '',
        detalhes: '',
      };

      return texto;
    }
  }

  private async ler(
    motivoRegex: RegExp,
    detalhesRegex: RegExp,
    url: string,
  ): Promise<TextoChecklist> {
    const pdf = new Pdf();
    const textoPdf = await pdf.ler(url);

    const motivo = await this.processarRegex(motivoRegex, textoPdf);
    const detalhes = await this.processarRegex(detalhesRegex, textoPdf);

    const texto: TextoChecklist = {
      motivo: motivo,
      detalhes: detalhes,
    };

    return texto;
  }

  private async processarRegex(regex: RegExp, texto: string): Promise<string> {
    const resultados: string[] = [];
    let match;

    while ((match = regex.exec(texto)) !== null) {
      resultados.push(match[1].trim().replace(/\s+/g, ' '));
    }

    if (resultados[0]) return resultados[0];
    else return '';
  }
}
