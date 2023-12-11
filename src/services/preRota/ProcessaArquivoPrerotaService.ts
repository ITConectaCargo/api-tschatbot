import ConsultaContatoService from "@services/contatos/ConsultaContatoService";
import Excel from "@utils/Excel";

export default class ProcessaArquivoPrerotaService {
  public async executar(localExcel: string): Promise<void> {
    const excel = new Excel()
    const consultaContato = new ConsultaContatoService()
    const dadosExcel = await excel.lerDados(localExcel)

    for (let i = 1; i < dadosExcel.length; i++) {
      const dados = dadosExcel[i]

      const contato = {
        "nome": dados[2],
        "telefone": dados[3],
        "cpfCnpj": dados[4],
        "endereco": {
          "rua": dados[6],
          "numero": dados[7],
          "bairro": dados[8],
          "cidade": dados[9],
          "stado": dados[10],
          "cep": dados[11],
          "complemento": dados[12]
        }
      }

      let destinatario = await consultaContato.porCpfCnpj(contato.cpfCnpj)
    }

  }
}
