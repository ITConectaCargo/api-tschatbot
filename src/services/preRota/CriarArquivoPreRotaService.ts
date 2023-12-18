import Excel from "@utils/Excel";
import PortalColeta from "@utils/PortalColeta";
import moment from "moment";
import path from "path";

interface Minuta {
  numero: string
  chaveNfe: string
}

interface DadosFinais {
  localBot: string
  localVerificar: string
  minutas: Minuta[]
}

export default class CriarArquivoPreRotaService {
  public async arquivoBot(excel: any[][], dataAgendamento: moment.Moment): Promise<DadosFinais> {
    const minutas: Minuta[] = [];
    const celulares: string[][] = [];
    const verificar: string[][] = [];

    const portalColeta = new PortalColeta()

    const possuiDDIRegex = /^55/
    const celularRegex = /^55\d{11}$/; // Padrão para números de telefone celular no Brasil
    const empresarialRegex = /^0800/; //verifica se é 0800
    const invalido = /1111111/

    for (let i = 1; i < excel.length; i++) {
      const linha = excel[i]
      const ocorrencia: string = linha[32]
      const embarcador: string = linha[16]
      const minuta: string = linha[2]
      const chaveNfe: string = linha[38]
      minutas.push({ numero: minuta, chaveNfe })
      const nome: string = linha[11];
      if (!nome) continue

      let nf: string = ''
      if (chaveNfe.length > 42) nf = chaveNfe.slice(25, 34);
      const cnpjEmbarcador: string = chaveNfe.slice(6, 14)

      const dadosPortal = await portalColeta.consultaPorChaveNfe(chaveNfe)
      const cpfCnpj: string = dadosPortal[0]?.cpf_cnpj_cliente
      const rua: string = dadosPortal[0]?.logradouro
      const numero: string = dadosPortal[0]?.numero
      const bairro: string = dadosPortal[0]?.bairro
      const cidade: string = dadosPortal[0]?.cidade
      const estado: string = dadosPortal[0]?.uf
      const cep: string = dadosPortal[0]?.cep
      const complemento: string = dadosPortal[0]?.complemento || ' '
      const endereco: string = `${rua} ${numero ? numero : ''} ${bairro} ${cidade} ${estado} ${cep}`
      let infoAdicional: string = dadosPortal[0]?.info_adicional

      const todosTelefones: string[] = []

      for (const portal of dadosPortal) {
        const tel1: string = portal.telefone_cliente
        if (tel1) todosTelefones.push(tel1)
        const tel2: string = portal.telefone2_cliente
        if (tel2) todosTelefones.push(tel2)
      }

      // const trataOcorrencia444 = async (telefone4: string) => {
      //   const regex = /\/\/\s*(\d+)\s*/g;
      //   let match;

      //   while ((match = regex.exec(telefone4)) !== null) {
      //     todosTelefones.push(match[1]);
      //   }
      // }

      const trataDadosAdicionais = async (infoAdicional: string) => {
        const telefoneRegex = /TELEF.CLIENTE:\s*([^]+?)RECADOS/gm
        const recadoRegex = /RECADOS([^]+?)LOCALIZACAO/gm

        const telefones: string[] = []

        const telefoneMatch = telefoneRegex.exec(infoAdicional);
        const recadoMatch = recadoRegex.exec(infoAdicional);
        if (telefoneMatch !== null) {
          if (telefoneMatch[1].trim() != '') {
            const numero = limparTelefone(telefoneMatch[1]); // Remove todos os não dígitos
            telefones.push(numero)
          }
        }

        if (recadoMatch !== null) {
          if (recadoMatch[1].trim() != '') {
            const numero = limparTelefone(recadoMatch[1]); // Remove todos os não dígitos
            telefones.push(numero)
          }
        }

        if (telefones.length > 0) {
          for (let i = 0; i < telefones.length; i++) {
            todosTelefones.push(telefones[i])
          }
        }
      }

      const limparTelefone = (tel: string): string => {
        const telLimpo = tel.replace(/[^\d]+/gm, ''); // Remove caracteres não numéricos

        if (empresarialRegex.test(telLimpo) || invalido.test(telLimpo)) {
          console.log("Telefone Inválido");
        } else if (!possuiDDIRegex.test(telLimpo)) {
          tel = '55' + telLimpo;
        }

        return tel;
      }

      if (infoAdicional) {
        await trataDadosAdicionais(infoAdicional)
      }

      for (let i = 0; i <= todosTelefones.length; i++) {
        if (todosTelefones[i]) todosTelefones[i] = limparTelefone(todosTelefones[i])
      }

      if (ocorrencia === 'A agendar' || ocorrencia === 'A Reagendar') {
        const telefonesAdicionados: string[] = []

        for (let i = 0; i < todosTelefones.length; i++) {
          const telefone = todosTelefones[i];
          if (telefone && !telefonesAdicionados.includes(telefone)) {
            const padraoBot: string[] = [minuta, chaveNfe, nome, telefone, cpfCnpj, embarcador, rua, numero, bairro, cidade, estado, cep, complemento, dataAgendamento.format('DD/MM/yyyy'), ocorrencia]
            telefonesAdicionados.push(telefone);

            if (invalido.test(telefone)) {
              verificar.push(padraoBot)
            } else if (celularRegex.test(telefone)) {
              padraoBot.push("Convencional")
              celulares.push(padraoBot);
            } else {
              verificar.push(padraoBot)
            }
          }

          if (telefonesAdicionados.length == 0) {
            const padraoBot = [minuta, chaveNfe, nome, "Não Encontrado", cpfCnpj, embarcador, rua, numero, bairro, cidade, estado, cep, complemento, dataAgendamento.format('DD/MM/yyyy'), ocorrencia]
            verificar.push(padraoBot)
          }
        }
      }
    }

    const colunas = [
      'Minuta',
      'ChaveNfe',
      'Nome',
      'Telefone',
      'CpfCnpj',
      'Embarcador',
      'Rua',
      'Numero',
      'Bairro',
      'Cidade',
      'Estado',
      'Cep',
      'Complemento',
      'Data',
      'Ultima Ocorrencia',
      'TipoProduto'
    ]


    const nomeArquivoCel = `Celulares-${dataAgendamento.format('DD-MM-yyyy')}`
    const nomeArquivoVerificar = `Verificar-${dataAgendamento.format('DD-MM-yyyy')}`

    const pastaRelatorios = path.join(process.cwd(), 'arquivos', 'excel');

    const excelSevice = new Excel()

    // Chamar o método criaPlanilha passando os arrays de celulares e fixos
    const localBot = await excelSevice.criaPlanilha(colunas, celulares, pastaRelatorios, nomeArquivoCel);
    const localVerificar = await excelSevice.criaPlanilha(colunas, verificar, pastaRelatorios, nomeArquivoVerificar);

    console.log('Celulares para Bot')
    console.log(celulares.length)

    const dadosFinais: DadosFinais = {
      localBot,
      localVerificar,
      minutas
    }

    return dadosFinais
  }
}

