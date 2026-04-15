import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { UserRepository } from './repositories/UserRepository';
import { GameRepository } from './repositories/GameRepository';
import { PurchaseRepository } from './repositories/PurchaseRepository';
import { AuthService } from './services/AuthService';
import { authMiddleware } from './middleware/auth';
import { adminMiddleware } from './middleware/admin';
import { Validators } from './utils/Validators';
import { CpfValidator } from './utils/CpfValidator';

const app = express();

app.use(cors());
app.use(express.json());

const userRepository = new UserRepository();
const gameRepository = new GameRepository();
const purchaseRepository = new PurchaseRepository();
const authService = new AuthService();

// LOGIN
app.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        message: 'Email e senha são obrigatórios'
      });
    }

    if (!Validators.isEmailValid(email)) {
      return res.status(400).json({
        message: 'Email inválido'
      });
    }

    const user = await userRepository.findByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: 'E-mail ou senha incorretos'
      });
    }

    const token = await authService.compareAndGenerateToken(senha, user);

    if (!token) {
      return res.status(401).json({
        message: 'E-mail ou senha incorretos'
      });
    }

    return res.json({
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        cpf: user.cpf,
        nivel_acesso: user.nivel_acesso
      },
      token
    });
  } catch (error) {
    console.error('Erro no Login:', error);

    return res.status(500).json({
      message: 'Erro interno no servidor'
    });
  }
});

// REGISTRO
app.post('/register', async (req, res) => {
  try {
    const { nome, email, cpf, senha } = req.body;

    if (!nome || !email || !cpf || !senha) {
      return res.status(400).json({
        message: 'Todos os campos são obrigatórios'
      });
    }

    if (!Validators.isEmailValid(email)) {
      return res.status(400).json({
        message: 'Email inválido'
      });
    }

    if (!CpfValidator.isValid(cpf)) {
      return res.status(400).json({
        message: 'CPF inválido'
      });
    }

    if (!Validators.isPasswordStrong(senha)) {
      return res.status(400).json({
        message: 'A senha deve ter no mínimo 8 caracteres e 1 número'
      });
    }

    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        message: 'Email já cadastrado'
      });
    }

    const hashedSenha = await authService.hashPassword(senha);

    await userRepository.create({
      nome,
      email,
      cpf: cpf.replace(/\D/g, ''),
      senha: hashedSenha,
      nivel_acesso: 'cliente'
    });

    return res.status(201).json({
      message: 'Usuário criado com sucesso'
    });
  } catch (error) {
    console.error('Erro no Register:', error);

    return res.status(500).json({
      message: 'Erro ao registrar usuário'
    });
  }
});

// PERFIL
app.put('/users/profile', authMiddleware, async (req: any, res) => {
  try {
    const userId = req.user?.id;
    const { nome, senha } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: 'Usuário não autenticado'
      });
    }

    if (!nome || !nome.trim()) {
      return res.status(400).json({
        message: 'Nome é obrigatório'
      });
    }

    const currentUser = await userRepository.findByIdWithPassword(userId);

    if (!currentUser) {
      return res.status(404).json({
        message: 'Usuário não encontrado'
      });
    }

    let senhaHash: string | undefined;

    if (senha) {
      if (!Validators.isPasswordStrong(senha)) {
        return res.status(400).json({
          message: 'A senha deve ter no mínimo 8 caracteres e 1 número'
        });
      }

      const isSamePassword = await bcrypt.compare(senha, currentUser.senha!);

      if (isSamePassword) {
        return res.status(400).json({
          message: 'A nova senha não pode ser igual à senha atual'
        });
      }

      senhaHash = await authService.hashPassword(senha);
    }

    await userRepository.updateProfile(userId, nome.trim(), senhaHash);

    const updatedUser = await userRepository.findById(userId);

    return res.json({
      message: 'Perfil atualizado com sucesso',
      user: updatedUser
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);

    return res.status(500).json({
      message: 'Erro ao atualizar perfil'
    });
  }
});

// LISTAR JOGOS
const listarJogos = async (req: any, res: any) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await gameRepository.listAll(page, limit);

    return res.json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Erro ao buscar jogos'
    });
  }
};

app.get('/jogos', listarJogos);
app.get('/games', listarJogos);

// BUSCAR JOGO POR ID
app.get('/jogos/:id', async (req, res) => {
  try {
    const game = await gameRepository.findById(Number(req.params.id));

    if (!game) {
      return res.status(404).json({
        message: 'Jogo não encontrado'
      });
    }

    return res.json(game);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Erro ao buscar jogo'
    });
  }
});

app.get('/games/:id', async (req, res) => {
  try {
    const game = await gameRepository.findById(Number(req.params.id));

    if (!game) {
      return res.status(404).json({
        message: 'Jogo não encontrado'
      });
    }

    return res.json(game);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Erro ao buscar jogo'
    });
  }
});

// CRIAR JOGO
app.post('/jogos', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const novoJogo = await gameRepository.create(req.body);

    return res.status(201).json(novoJogo);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Erro ao criar jogo'
    });
  }
});

app.post('/games', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const novoJogo = await gameRepository.create(req.body);

    return res.status(201).json(novoJogo);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Erro ao criar jogo'
    });
  }
});

// EDITAR JOGO
app.put('/jogos/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const jogo = await gameRepository.update(
      Number(req.params.id),
      req.body
    );

    return res.json(jogo);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Erro ao atualizar jogo'
    });
  }
});

app.put('/games/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const jogo = await gameRepository.update(
      Number(req.params.id),
      req.body
    );

    return res.json(jogo);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Erro ao atualizar jogo'
    });
  }
});

// EXCLUIR JOGO
app.delete('/jogos/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await gameRepository.delete(Number(req.params.id));

    return res.json({
      message: 'Jogo removido com sucesso'
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Erro ao excluir jogo'
    });
  }
});

app.delete('/games/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await gameRepository.delete(Number(req.params.id));

    return res.json({
      message: 'Jogo removido com sucesso'
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Erro ao excluir jogo'
    });
  }
});

// DASHBOARD ADMIN
app.get('/dashboard/admin', authMiddleware, adminMiddleware, async (_req, res) => {
  try {
    const stats = await gameRepository.getDashboardStats();

    return res.json(stats);
  } catch (error) {
    console.error('Erro ao carregar dashboard admin:', error);

    return res.status(500).json({
      message: 'Erro ao carregar dashboard admin'
    });
  }
});

// DASHBOARD VENDAS
app.get('/dashboard/sales', authMiddleware, adminMiddleware, async (_req, res) => {
  try {
    const sales = await purchaseRepository.getSalesStats();

    return res.json(sales);
  } catch (error) {
    console.error('Erro ao carregar dashboard de vendas:', error);

    return res.status(500).json({
      message: 'Erro ao carregar dashboard de vendas'
    });
  }
});

// BIBLIOTECA DO USUÁRIO
app.get('/users/library', authMiddleware, async (req: any, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Usuário não autenticado'
      });
    }

    const library = await purchaseRepository.getLibraryByUserId(Number(userId));

    return res.json(library);
  } catch (error) {
    console.error('Erro ao buscar biblioteca:', error);

    return res.status(500).json({
      message: 'Erro ao buscar biblioteca'
    });
  }
});

// COMPRA
app.post('/purchase', authMiddleware, async (req: any, res) => {
  try {
    const { gameId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Usuário não autenticado'
      });
    }

    if (!gameId) {
      return res.status(400).json({
        message: 'gameId é obrigatório'
      });
    }

    const game = await gameRepository.findById(Number(gameId));

    if (!game) {
      return res.status(404).json({
        message: 'Jogo não encontrado'
      });
    }

    await purchaseRepository.create(Number(userId), Number(gameId));

    return res.status(201).json({
      message: 'Compra registrada com sucesso'
    });
  } catch (error: any) {
    console.error('Erro ao registrar compra:', error);

    if (error.message === 'Jogo não encontrado') {
      return res.status(404).json({
        message: error.message
      });
    }

    if (error.message === 'Jogo sem estoque') {
      return res.status(400).json({
        message: error.message
      });
    }

    if (error.message === 'Jogo já adquirido') {
      return res.status(400).json({
        message: error.message
      });
    }

    return res.status(500).json({
      message: 'Erro ao registrar compra'
    });
  }
});

export { app };