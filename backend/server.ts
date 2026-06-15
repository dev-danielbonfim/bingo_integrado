import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import path from 'path';

const app = express();
app.use(cors());

// Servir o Frontend construído junto com o Backend
const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Permite acesso de qualquer lugar (ideal para testes locais)
    methods: ["GET", "POST"]
  }
});

interface GameState {
  drawnNumbers: number[];
  lastDrawn: number | null;
}

// Estado do Jogo
let gameState: GameState = {
  drawnNumbers: [],
  lastDrawn: null,
};

io.on('connection', (socket: Socket) => {
  console.log('Um usuário conectou:', socket.id);

  // Enviar o estado atual do jogo para quem acabou de se conectar
  socket.emit('gameStateUpdate', gameState);

  socket.on('verifyAdmin', (password: string, callback: (success: boolean) => void) => {
    // A senha real pode ser definida via painel do Render em variáveis de ambiente
    const adminPassword = process.env.ADMIN_PASSWORD || 'INTEGRADO2026';
    if (password === adminPassword) {
      callback(true);
    } else {
      callback(false);
    }
  });

  // Evento para sortear um número
  socket.on('drawNumber', (number: number) => {
    if (!gameState.drawnNumbers.includes(number)) {
      gameState.drawnNumbers.push(number);
      gameState.lastDrawn = number;
      
      // Emitir o novo estado para TODOS os clientes conectados
      io.emit('gameStateUpdate', gameState);
    }
  });

  // Evento para reiniciar o jogo
  socket.on('resetGame', () => {
    gameState = { drawnNumbers: [], lastDrawn: null };
    io.emit('gameStateUpdate', gameState);
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado:', socket.id);
  });
});

// Redireciona qualquer outra rota para o React (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
