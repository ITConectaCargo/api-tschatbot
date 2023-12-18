import Esl from "@utils/Esl"
import { Request, Response } from "express"

export default class TestesController {
  public async teste1(req: Request, res: Response): Promise<void> {
    const chaveNfe = req.params.chaveNfe
    const esl = new Esl()

    const dadosEsl = await esl.consultarOcorrencia(chaveNfe)

    if(!dadosEsl) res.status(404).json({mensagem: 'nada foi encontrado na ESL'})
    res.status(200).json(dadosEsl)
  }
}
