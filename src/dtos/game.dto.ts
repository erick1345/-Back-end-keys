/** Dados de entrada para criar um jogo (DTO). */
export interface CreateGameDTO {
  titulo: string;
  descricao?: string;
  preco: number;
  plataforma: string;
  estoque: number;
  imagem_url?: string;
  requisitos_minimos?: string;
  requisitos_recomendados?: string;
}

/** Dados de entrada para atualizar um jogo (DTO). */
export type UpdateGameDTO = CreateGameDTO;
