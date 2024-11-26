const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

// Crear una instancia de Express
const app = express();

// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:4200', // Cambia este valor al puerto de tu cliente Angular
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

// Usar el middleware CORS
app.use(cors(corsOptions));

// Crear el servidor HTTP con Express
const server = http.createServer(app);

// Configurar Socket.IO para usar el servidor HTTP
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:4200', // Asegúrate de que coincida con el origen del cliente
    methods: ['GET', 'POST'],
  },
});

// Simular datos del leaderboard
let leaderboard = [
  { name: 'Jugador1', score: 1000 },
  { name: 'Jugador2', score: 800 },
  { name: 'Jugador3', score: 600 },
];

// Función para actualizar el leaderboard
function updateLeaderboard() {
  // Aquí podrías conectar con tu base de datos y obtener los datos reales
  leaderboard.push({
    name: `Jugador${leaderboard.length + 1}`,
    score: Math.floor(Math.random() * 1000),
  });

  console.log('Leaderboard Updated');

  // Emitir el evento 'leaderboard-update' a todos los clientes conectados
  io.emit('leaderboard-update', leaderboard);
}

// Emitir una actualización del leaderboard cada 10 segundos (simulación)
setInterval(updateLeaderboard, 10000);

// Evento de conexión de Socket.IO
io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado', socket.id);

  // Emitir el leaderboard actual al cliente recién conectado
  socket.emit('leaderboard-update', leaderboard);

  // Escuchar eventos desde el cliente (puedes agregar eventos personalizados si lo deseas)
  socket.on('client-event', (data) => {
    console.log('Datos del cliente:', data);
  });

  // Evento de desconexión
  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado');
  });
});

// Iniciar el servidor en un puerto
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Servidor funcionando en el puerto ${port}`);
});
