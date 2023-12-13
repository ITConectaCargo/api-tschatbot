import ConsultaContatoService from "@services/contatos/ConsultaContatoService";
import CriarContatoService from "@services/contatos/CriarContatoService";
import AtualizarContatoService from "@services/contatos/AtualizarContatoService";
import TratarDadosService from "@services/uras/TratarDadosServices";
import Excel from "@utils/Excel";
import moment from "moment";
import dotenv from 'dotenv'
dotenv.config()

const phoneId = process.env.PHONEID
export default class ProcessaArquivoPrerotaService {
  public async executar(localExcel: string): Promise<void> {
    const excel = new Excel()
    const atualizarContato = new AtualizarContatoService()
    const criarContato = new CriarContatoService()
    const consultaContato = new ConsultaContatoService()
    const tratarDadosAtivo = new TratarDadosService()
    const dadosExcel = await excel.lerDados(localExcel)

    const remetente = await consultaContato.contatoAdm()

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
          "estado": dados[10],
          "cep": dados[11],
          "complemento": dados[12]
        }
      }

      let destinatario = await consultaContato.porCpfCnpj(contato.cpfCnpj)

      if (!destinatario) {
        destinatario = await criarContato.executar({
          nome: contato.nome,
          telefone: contato.telefone,
          cpfCnpj: contato.cpfCnpj,
          endereco: contato.endereco,
          estaAtivo: true,
        })

      } else {
        if (
          contato.telefone != destinatario.telefone &&
          contato.telefone != destinatario?.telefone2 &&
          contato.telefone != destinatario?.telefone3
        ) {
          if (!destinatario.telefone2) {
            console.log("atualizando telefone2");
            destinatario.telefone2 = contato.telefone
            destinatario = await atualizarContato.porId(destinatario)
          } else if (!destinatario.telefone3) {
            console.log("atualizando telefone3");
            destinatario.telefone3 = contato.telefone
            destinatario = await atualizarContato.porId(destinatario)
          } else {
            console.log("criando novo contato");
            destinatario.estaAtivo = false
            await atualizarContato.porId(destinatario)
            destinatario = await criarContato.executar({
              nome: contato.nome,
              telefone: contato.telefone,
              cpfCnpj: contato.cpfCnpj,
              endereco: contato.endereco,
              estaAtivo: true,
            })
          }
        }
      }

      if (destinatario && remetente) {
        const mensagem = {
          nome: destinatario.nome,
          telefone: contato.telefone,
          para: remetente.telefone,
          phoneId: phoneId || '',
          timestamp: moment().unix(),
          texto: "Mensagem Template Ativo",
          dataAgendamento: moment(dados[13], 'DD/MM/yyyy'),
          minuta: dados[0],
          chaveNfe: dados[1],
          ocorrencia: dados[14],
          sensivel: dados[15]
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(contato.nome)
        tratarDadosAtivo.ativo(mensagem, destinatario)
      }
    }
  }
}

