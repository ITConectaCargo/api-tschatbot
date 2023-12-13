import dotenv from 'dotenv'
dotenv.config()

export default class Esl {
  public async consultaOcorrencia(chaveNfe: string) {
    let urlESL = `https://conecta.eslcloud.com.br/api/invoice_occurrences?invoice_key=${chaveNfe}`

    let response = await fetch(urlESL, {
      headers: {
        Authorization: `Bearer ${process.env.TOKENCONSULTAELS}`
      }
    });

    let dados: any = await response.json();
    if (dados.paging.next_id) {
      response = await fetch(urlESL + `&start=${dados.paging.next_id}`, {
        headers: {
          Authorization: `Bearer ${process.env.TOKENCONSULTAELS}`
        }
      });
      const pagina: any = await response.json()
      dados.data.push(...pagina.data)
    }
    return dados.data;
  }
}
