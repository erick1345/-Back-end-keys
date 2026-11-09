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
import { publicarEvento, CANAIS } from './messaging/events';
import { GameController } from './controllers/GameController';
import { errorHandler } from './middleware/errorHandler';
import swaggerUi from 'swagger-ui-express';
import { openapiSpec } from './docs/openapi';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(UPLOAD_DIR));

// Documentacao da API: Swagger UI em /docs e o documento OpenAPI em /openapi.json
app.get('/openapi.json', (_req, res) => res.json(openapiSpec));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec as any));

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

// --- Rotas de jogos: controller fino -> GameService (regra) -> GameRepository (banco) ---
app.get('/jogos', GameController.listar);
app.get('/games', GameController.listar);

app.get('/jogos/:id', GameController.detalhar);
app.get('/games/:id', GameController.detalhar);

app.post('/jogos', authMiddleware, adminMiddleware, GameController.criar);
app.post('/games', authMiddleware, adminMiddleware, GameController.criar);

app.put('/jogos/:id', authMiddleware, adminMiddleware, GameController.atualizar);
app.put('/games/:id', authMiddleware, adminMiddleware, GameController.atualizar);

app.delete('/jogos/:id', authMiddleware, adminMiddleware, GameController.remover);
app.delete('/games/:id', authMiddleware, adminMiddleware, GameController.remover);

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

// Tratamento de erros centralizado (ultimo middleware)
app.use(errorHandler);

export { app };