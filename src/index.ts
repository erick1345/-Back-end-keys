import express from 'express';
import cors from 'cors';
import { UserRepository } from './repositories/UserRepository';
import { GameRepository } from './repositories/GameRepository';
import { AuthService } from './services/AuthService';

const app = express();

app.use(cors());
app.use(express.json());

const userRepository = new UserRepository();
const gameRepository = new GameRepository();
const authService = new AuthService();

/*
====================================
USUÁRIOS
====================================
*/

app.post('/register', async (req, res) => {
  try {
    await userRepository.create(req.body);
    res.status(201).json({ mensagem: 'Usuário criado com sucesso' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao registrar usuário' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const user = await userRepository.findByEmail(req.body.email);

    if (!user) {
      return res.status(401).json({ erro: 'Usuário não encontrado' });
    }

    const token = await authService.compareAndGenerateToken(
      req.body.senha,
      user
    );

    if (!token) {
      return res.status(401).json({ erro: 'Senha inválida' });
    }

    res.json({
      token,
      user
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ erro: 'Erro no login' });
  }
});

/*
====================================
JOGOS
====================================
*/

app.get('/games', async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const games = await gameRepository.listAll(page, limit);

    res.json(games);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar jogos' });
  }
});

app.post('/games', async (req, res) => {
  try {
    const game = await gameRepository.create(req.body);
    res.status(201).json(game);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao criar jogo' });
  }
});

app.put('/games/:id', async (req, res) => {
  try {
    await gameRepository.update(Number(req.params.id), req.body);
    res.json({ mensagem: 'Jogo atualizado com sucesso' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao atualizar jogo' });
  }
});

app.delete('/games/:id', async (req, res) => {
  try {
    await gameRepository.delete(Number(req.params.id));
    res.json({ mensagem: 'Jogo removido com sucesso' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao deletar jogo' });
  }
});

/*
====================================
START SERVER
====================================
*/

app.listen(3001, () => {
  console.log('Servidor rodando em http://localhost:3001');
});