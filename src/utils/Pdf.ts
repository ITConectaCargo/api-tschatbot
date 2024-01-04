import axios from 'axios';
import pdfParse from 'pdf-parse';

export default class Pdf {
  public async ler(caminhoArquivo: string): Promise<string> {
    try {
      // Carregar o arquivo PDF
      const resposta = await axios.get(caminhoArquivo, {
        responseType: 'arraybuffer',
      });

      // Converter o buffer para uma string
      const buffer = Buffer.from(resposta.data);
      const resultado = await pdfParse(buffer);
      const textoPDF = resultado.text;

      // Retornar o texto do PDF
      return textoPDF;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.response?.status)
        console.error('Erro ao ler o arquivo PDF:', error.response.status);
      else console.error('Erro ao ler o arquivo PDF:', error);
      console.log(`Caminho ${caminhoArquivo}`);
      return '';
    }
  }
}
