import { Server } from 'socket.io';
import http from 'http';
import { Mensagem } from '@Interfaces/IMensagem';
import { Protocolo } from '@Interfaces/IProtocolo';

let io: Server;

export function initializeSocketServer(server: http.Server): void {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    path: '/api/socket.io',
  });

  io.on('connection', socket => {
    console.log('Um cliente se conectou ao Socket.IO');

    socket.emit('server-message', 'Bem-vindo ao servidor Socket.IO!');

    socket.on('chat-atendente', sala => {
      socket.join(sala);
      console.log(`usuario com o ID ${socket.id} entrou na sala ${sala}`);
    });

    socket.on('ping', () => {
      socket.emit('pong');
    });

    socket.on('disconnect', () => {
      console.log(`usuario ${socket.id} Desconectou`);
    });
  });
}

export function socketMensagemAtendente(
  atendenteId: string,
  mensagem: Mensagem,
): void {
  if (io) {
    io.to(atendenteId).emit('mensagem-atendente', mensagem);
  } else {
    console.error('Servidor Socket.IO não inicializado.');
  }
}

export function socketStatusMensagem(
  atendenteId: string,
  mensagem: Mensagem,
): void {
  if (io) {
    io.to(atendenteId).emit('status-mensagem', mensagem);
  } else {
    console.error('Servidor Socket.IO não inicializado.');
  }
}

export function socketProtocoloEmEspera(protocolo: Protocolo): void {
  if (io) {
    io.emit('protocolo-espera', protocolo);
  } else {
    console.error('Servidor Socket.IO não inicializado.');
  }
}
