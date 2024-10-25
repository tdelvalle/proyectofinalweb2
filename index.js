import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { verifyToken } from './middlewares/authMiddleware.js';

// Configurar dotenv para cargar variables de entorno
dotenv.config();

// Crear aplicación de Express y servidor HTTP para Socket.io
const app = express();
const server = createServer(app);
const io = new Server(server);

// Middleware para parsear JSON
app.use(express.json());

// Conexión a la base de datos MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/tasks', verifyToken, taskRoutes); // Verificación de token para las rutas de tareas

// Configuración de Socket.io
io.on('connection', (socket) => {
  console.log('Usuario conectado');
  
  // Ejemplo: Evento de mensaje
  socket.on('message', (msg) => {
    console.log('Mensaje recibido:', msg);
    io.emit('message', msg); // Emite el mensaje a todos los usuarios conectados
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
