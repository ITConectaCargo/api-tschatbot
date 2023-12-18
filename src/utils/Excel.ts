import xlsx from 'xlsx';
import fs from 'fs'
import { join } from 'path';
import AppError from './AppError';

export default class Excel {
  public async lerDados(url: string): Promise<any[][]> {
    if (!fs.existsSync(url)) {
      throw new AppError('O arquivo não foi encontrado no caminho especificado', 404);
    }

    const workbook = xlsx.readFile(url);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const dadosExcel = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    if (!dadosExcel) {
      throw new AppError('Erro ao ler Excel')
    }

    return dadosExcel as any[][];
  };

  public async criaPlanilha(
    colunas: any[],
    dados: any[][],
    url: string,
    nomeArquivo: string
  ): Promise<string> {
    try {
      const newWorkbook = xlsx.utils.book_new();

      const worksheet = xlsx.utils.aoa_to_sheet([
        colunas, ...dados
      ]);
      xlsx.utils.book_append_sheet(newWorkbook, worksheet, 'Planilha');

      const localArquivo = join(url, `${nomeArquivo}.xlsx`);
      xlsx.writeFile(newWorkbook, localArquivo);

      return localArquivo;
    } catch (error) {
      console.log(error)
      throw new AppError('Erro ao criar Planilha')
    }
  }
}
