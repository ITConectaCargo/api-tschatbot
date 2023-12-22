// OcorrenciasEnum.ts

export enum Ocorrencia {
  Agendar = 300,
  ProdutoDevolvido = 304,
  ProdutoDivergente = 305,
  FicarComProduto = 306,
}

export const DescricaoOcorrencias: Record<Ocorrencia, string> = {
  [Ocorrencia.Agendar]: "A Agendar",
  [Ocorrencia.ProdutoDevolvido]: "Produto Devolvido",
  [Ocorrencia.ProdutoDivergente]: "Produto Divergente",
  [Ocorrencia.FicarComProduto]: "Vai Ficar com o Produto",
};
