/**
 * Especificacao OpenAPI 3.0 da API do PlayHub (keys-forge).
 * Servida como Swagger UI em /docs e como documento em /openapi.json.
 */
export const openapiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'PlayHub API (keys-forge)',
    version: '1.0.0',
    description:
      'API da loja de jogos PlayHub: autenticacao (JWT), catalogo de jogos (CRUD), ' +
      'compras/biblioteca, upload de imagens e dashboard. Backend Node/Express + MySQL, ' +
      'com cache e mensageria em Redis.',
  },
  servers: [
    { url: 'http://localhost:3001', description: 'Desenvolvimento (local)' },
    { url: 'https://keys-forge.local/api', description: 'Docker (Nginx proxy reverso)' },
  ],
  tags: [
    { name: 'Auth', description: 'Login e cadastro' },
    { name: 'Jogos', description: 'Catalogo de jogos' },
    { name: 'Compras', description: 'Compra e biblioteca do usuario' },
    { name: 'Usuario', description: 'Perfil e foto' },
    { name: 'Admin', description: 'Dashboard e gestao (requer admin)' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      Jogo: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          titulo: { type: 'string', example: 'Elden Ring' },
          descricao: { type: 'string', example: 'RPG de acao' },
          preco: { type: 'number', format: 'float', example: 249.9 },
          plataforma: { type: 'string', example: 'PC' },
          estoque: { type: 'integer', example: 10 },
          imagem_url: { type: 'string', example: '/uploads/1699999999999-abc.png' },
          requisitos_minimos: { type: 'string', nullable: true },
          requisitos_recomendados: { type: 'string', nullable: true },
        },
      },
      JogoInput: {
        type: 'object',
        required: ['titulo', 'plataforma', 'preco', 'estoque'],
        properties: {
          titulo: { type: 'string', example: 'Elden Ring' },
          descricao: { type: 'string', example: 'RPG de acao' },
          preco: { type: 'number', example: 249.9 },
          plataforma: { type: 'string', example: 'PC' },
          estoque: { type: 'integer', example: 10 },
          imagem_url: { type: 'string', example: '/uploads/1699999999999-abc.png' },
          requisitos_minimos: { type: 'string' },
          requisitos_recomendados: { type: 'string' },
        },
      },
      ListaJogos: {
        type: 'object',
        properties: {
          jogos: { type: 'array', items: { $ref: '#/components/schemas/Jogo' } },
          total: { type: 'integer', example: 94 },
          totalPages: { type: 'integer', example: 10 },
          currentPage: { type: 'integer', example: 1 },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'senha'],
        properties: {
          email: { type: 'string', example: 'usuario@email.com' },
          senha: { type: 'string', example: 'SenhaForte@123' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...' },
          user: { $ref: '#/components/schemas/Usuario' },
        },
      },
      RegisterInput: {
        type: 'object',
        required: ['nome', 'email', 'cpf', 'senha'],
        properties: {
          nome: { type: 'string', example: 'Maria Silva' },
          email: { type: 'string', example: 'maria@email.com' },
          cpf: { type: 'string', example: '12345678909' },
          senha: { type: 'string', example: 'SenhaForte@123' },
        },
      },
      Usuario: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 6 },
          nome: { type: 'string', example: 'Maria Silva' },
          email: { type: 'string', example: 'maria@email.com' },
          nivel_acesso: { type: 'string', enum: ['admin', 'cliente'], example: 'cliente' },
          foto_url: { type: 'string', nullable: true },
        },
      },
      Mensagem: {
        type: 'object',
        properties: { message: { type: 'string', example: 'Operacao realizada com sucesso' } },
      },
    },
  },
  paths: {
    '/login': {
      post: {
        tags: ['Auth'],
        summary: 'Autentica e retorna um token JWT',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } } } },
        responses: {
          200: { description: 'Autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } } },
          401: { description: 'Credenciais invalidas', content: { 'application/json': { schema: { $ref: '#/components/schemas/Mensagem' } } } },
        },
      },
    },
    '/register': {
      post: {
        tags: ['Auth'],
        summary: 'Cria um novo usuario (cliente)',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterInput' } } } },
        responses: {
          201: { description: 'Usuario criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Mensagem' } } } },
          400: { description: 'Dados invalidos (email, CPF ou senha)', content: { 'application/json': { schema: { $ref: '#/components/schemas/Mensagem' } } } },
        },
      },
    },
    '/jogos': {
      get: {
        tags: ['Jogos'],
        summary: 'Lista jogos (paginado) — usa cache Redis',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: {
          200: {
            description: 'Lista de jogos',
            headers: { 'X-Cache': { description: 'HIT (veio do Redis) ou MISS', schema: { type: 'string' } } },
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ListaJogos' } } },
          },
        },
      },
      post: {
        tags: ['Jogos'],
        summary: 'Cria um jogo (admin)',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/JogoInput' } } } },
        responses: {
          201: { description: 'Jogo criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Jogo' } } } },
          401: { description: 'Nao autenticado' },
          403: { description: 'Sem permissao de admin' },
        },
      },
    },
    '/jogos/{id}': {
      get: {
        tags: ['Jogos'],
        summary: 'Detalhe de um jogo',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Jogo', content: { 'application/json': { schema: { $ref: '#/components/schemas/Jogo' } } } },
          404: { description: 'Jogo nao encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Mensagem' } } } },
        },
      },
      put: {
        tags: ['Jogos'],
        summary: 'Atualiza um jogo (admin) — invalida o cache',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/JogoInput' } } } },
        responses: {
          200: { description: 'Jogo atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Jogo' } } } },
          404: { description: 'Jogo nao encontrado' },
        },
      },
      delete: {
        tags: ['Jogos'],
        summary: 'Remove um jogo (admin) — invalida o cache e apaga a imagem',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Removido', content: { 'application/json': { schema: { $ref: '#/components/schemas/Mensagem' } } } },
          404: { description: 'Jogo nao encontrado' },
        },
      },
    },
    '/purchase': {
      post: {
        tags: ['Compras'],
        summary: 'Registra a compra de um jogo',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', required: ['gameId'], properties: { gameId: { type: 'integer', example: 1 } } } } },
        },
        responses: {
          201: { description: 'Compra registrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Mensagem' } } } },
          400: { description: 'Sem estoque ou dados invalidos' },
          401: { description: 'Nao autenticado' },
        },
      },
    },
    '/users/library': {
      get: {
        tags: ['Compras'],
        summary: 'Biblioteca de jogos do usuario autenticado',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Jogos comprados', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Jogo' } } } } },
          401: { description: 'Nao autenticado' },
        },
      },
    },
    '/users/profile': {
      put: {
        tags: ['Usuario'],
        summary: 'Atualiza nome e/ou senha do usuario',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { nome: { type: 'string' }, senha: { type: 'string' } } } } },
        },
        responses: { 200: { description: 'Perfil atualizado' }, 401: { description: 'Nao autenticado' } },
      },
    },
    '/users/avatar': {
      post: {
        tags: ['Usuario'],
        summary: 'Envia/atualiza a foto de perfil (upload)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'multipart/form-data': { schema: { type: 'object', properties: { imagem: { type: 'string', format: 'binary' } } } } },
        },
        responses: { 200: { description: 'Foto atualizada' }, 400: { description: 'Imagem invalida (formato ou >5MB)' } },
      },
    },
    '/upload': {
      post: {
        tags: ['Jogos'],
        summary: 'Upload de imagem de capa (admin) — valida formato e tamanho',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'multipart/form-data': { schema: { type: 'object', properties: { imagem: { type: 'string', format: 'binary' } } } } },
        },
        responses: {
          201: { description: 'Imagem enviada', content: { 'application/json': { schema: { type: 'object', properties: { url: { type: 'string', example: '/uploads/....png' } } } } } },
          400: { description: 'Formato invalido ou imagem maior que 5MB' },
        },
      },
    },
    '/dashboard/admin': {
      get: {
        tags: ['Admin'],
        summary: 'Indicadores do estoque de jogos (admin)',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Estatisticas' }, 403: { description: 'Sem permissao' } },
      },
    },
    '/dashboard/sales': {
      get: {
        tags: ['Admin'],
        summary: 'Estatisticas de vendas (admin)',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Vendas' }, 403: { description: 'Sem permissao' } },
      },
    },
  },
} as const;
