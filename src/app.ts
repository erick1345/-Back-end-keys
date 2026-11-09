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
import multer from 'multer';
import { uploadImage, UPLOAD_DIR, removeUploadedImage } from './middleware/upload';
import { cacheGet, cacheSet, cacheInvalidate } from './cache/cache';
import { publicarEvento, CANAIS } from './messaging/events';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(UPLOAD_DIR));

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
        message: 'E-mail ou senha incorret'
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
        nivel_acesso: user.nivel_acesso,
        foto_url: user.foto_url
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

app.post('/users/avatar', authMiddleware, (req: any, res) => {
  uploadImage.single('imagem')(req, res, (err: any) => {
    if (err) {
      const message =
        err instanceof multer.MulterError
          ? err.code === 'LIMIT_FILE_SIZE'
            ? 'Imagem muito grande (maximo 5 MB).'
            : 'Erro no envio da imagem.'
          : err.message;

      return res.status(400).json({ message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Nenhuma imagem enviada.' });
    }

    const userId = Number(req.user?.id);
    const fotoUrl = `/uploads/${req.file.filename}`;

    userRepository
      .findById(userId)
      .then((anterior) =>
        userRepository.updateAvatar(userId, fotoUrl).then(() => {
          // apaga a foto de perfil antiga do disco (se for upload local)
          if (anterior && anterior.foto_url && anterior.foto_url !== fotoUrl) {
            removeUploadedImage(anterior.foto_url);
          }
          return userRepository.findById(userId);
        })
      )
      .then((user) => res.status(200).json({ user }))
      .catch((error) => {
        console.error('Erro ao salvar foto de perfil:', error);
        res.status(500).json({ message: 'Erro ao salvar a foto.' });
      });
  });
});


app.get('/admin/users', authMiddleware, adminMiddleware, async (_req, res) => {
  try {
    const users = await userRepository.listAll();

    return res.json(users);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);

    return res.status(500).json({
      message: 'Erro ao listar usuários'
    });
  }
});


app.get('/admin/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await userRepository.findById(Number(req.params.id));

    if (!user) {
      return res.status(404).json({
        message: 'Usuário não encontrado'
      });
    }

    return res.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);

    return res.status(500).json({
      message: 'Erro ao buscar usuário'
    });
  }
});

app.post('/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { nome, email, cpf, senha, nivel_acesso } = req.body;

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

    if (nivel_acesso && nivel_acesso !== 'admin' && nivel_acesso !== 'cliente') {
      return res.status(400).json({
        message: 'Nível de acesso inválido'
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
      nivel_acesso: nivel_acesso || 'cliente'
    });

    const created = await userRepository.findByEmail(email);

    return res.status(201).json({
      id: created?.id,
      nome: created?.nome,
      email: created?.email,
      cpf: created?.cpf,
      nivel_acesso: created?.nivel_acesso
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);

    return res.status(500).json({
      message: 'Erro ao criar usuário'
    });
  }
});

app.put('/admin/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { nome, nivel_acesso } = req.body;

    if (!nome || !nome.trim()) {
      return res.status(400).json({
        message: 'Nome é obrigatório'
      });
    }

    if (nivel_acesso && nivel_acesso !== 'admin' && nivel_acesso !== 'cliente') {
      return res.status(400).json({
        message: 'Nível de acesso inválido'
      });
    }

    const existing = await userRepository.findById(Number(req.params.id));

    if (!existing) {
      return res.status(404).json({
        message: 'Usuário não encontrado'
      });
    }

    await userRepository.adminUpdate(
      Number(req.params.id),
      nome.trim(),
      nivel_acesso || existing.nivel_acesso || 'cliente'
    );

    const updated = await userRepository.findById(Number(req.params.id));

    return res.json({
      message: 'Usuário atualizado com sucesso',
      user: updated
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);

    return res.status(500).json({
      message: 'Erro ao atualizar usuário'
    });
  }
});

app.delete('/admin/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const removed = await userRepository.delete(Number(req.params.id));

    if (!removed) {
      return res.status(404).json({
        message: 'Usuário não encontrado'
      });
    }

    return res.json({
      message: 'Usuário removido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);

    return res.status(500).json({
      message: 'Erro ao excluir usuário'
    });
  }
});


app.post('/upload', authMiddleware, adminMiddleware, (req, res) => {
  uploadImage.single('imagem')(req, res, (err: any) => {
    if (err) {
      const message =
        err instanceof multer.MulterError
          ? err.code === 'LIMIT_FILE_SIZE'
            ? 'Imagem muito grande (maximo 5 MB).'
            : 'Erro no envio da imagem.'
          : err.message;

      return res.status(400).json({ message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Nenhuma imagem enviada.' });
    }
    return res.status(201).json({ url: `/uploads/${req.file.filename}` });
  });
});

const listarJogos = async (req: any, res: any) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const cacheKey = `jogos:page:${page}:limit:${limit}`;

    // 1) cache-aside: tenta servir do cache primeiro
    const cacheado = await cacheGet(cacheKey);
    if (cacheado) {
      console.log(`[cache] HIT  ${cacheKey}`);
      res.setHeader('X-Cache', 'HIT');
      return res.json(cacheado);
    }

    // 2) nao tinha no cache: busca no MySQL
    console.log(`[cache] MISS ${cacheKey} -> consultando MySQL`);
    const result = await gameRepository.listAll(page, limit);

    // 3) guarda no cache com expiracao (TTL) para as proximas requisicoes
    await cacheSet(cacheKey, result);
    res.setHeader('X-Cache', 'MISS');

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

// --- CRUD de jogos (handlers compartilhados por /jogos e /games) ---
// Toda escrita invalida o cache de listagem (jogos:*) para refletir a mudanca na hora.

const criarJogo = async (req: any, res: any) => {
  try {
    const novoJogo = await gameRepository.create(req.body);

    const n = await cacheInvalidate('jogos:*');
    console.log(`[cache] invalidado (${n} chaves) apos criar jogo`);

    await publicarEvento(CANAIS.JOGO_CRIADO, { id: novoJogo?.id, titulo: req.body.titulo });

    return res.status(201).json(novoJogo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao criar jogo' });
  }
};

const atualizarJogo = async (req: any, res: any) => {
  try {
    const id = Number(req.params.id);
    const anterior = await gameRepository.findById(id);

    const jogo = await gameRepository.update(id, req.body);

    // se a imagem foi trocada, apaga a antiga do disco (se for upload local)
    if (anterior && anterior.imagem_url !== req.body.imagem_url) {
      removeUploadedImage(anterior.imagem_url);
    }

    const n = await cacheInvalidate('jogos:*');
    console.log(`[cache] invalidado (${n} chaves) apos atualizar jogo ${id}`);

    await publicarEvento(CANAIS.JOGO_ATUALIZADO, { id, titulo: req.body.titulo });

    return res.json(jogo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao atualizar jogo' });
  }
};

const removerJogo = async (req: any, res: any) => {
  try {
    const id = Number(req.params.id);
    const jogo = await gameRepository.findById(id);

    await gameRepository.delete(id);

    // apaga tambem o arquivo da imagem do disco (se for upload local)
    if (jogo) removeUploadedImage(jogo.imagem_url);

    const n = await cacheInvalidate('jogos:*');
    console.log(`[cache] invalidado (${n} chaves) apos remover jogo ${id}`);

    await publicarEvento(CANAIS.JOGO_REMOVIDO, { id });

    return res.json({ message: 'Jogo removido com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao excluir jogo' });
  }
};

app.post('/jogos', authMiddleware, adminMiddleware, criarJogo);
app.post('/games', authMiddleware, adminMiddleware, criarJogo);

app.put('/jogos/:id', authMiddleware, adminMiddleware, atualizarJogo);
app.put('/games/:id', authMiddleware, adminMiddleware, atualizarJogo);

app.delete('/jogos/:id', authMiddleware, adminMiddleware, removerJogo);
app.delete('/games/:id', authMiddleware, adminMiddleware, removerJogo);

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

    const result: any = await purchaseRepository.create(Number(userId), Number(gameId));

    if (result && result.error) {
      return res.status(result.status ?? 400).json({ message: result.error });
    }

    await publicarEvento(CANAIS.COMPRA_REALIZADA, { userId, gameId: Number(gameId) });

    return res.status(201).json({
      message: 'Compra registrada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao registrar compra:', error);

    return res.status(500).json({
      message: 'Erro ao registrar compra'
    });
  }
});

export { app };