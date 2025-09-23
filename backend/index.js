const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

// Configurar CORS
app.use(cors({
  origin: 'http://localhost:3000', // Permitir peticiones desde el frontend
  credentials: true
}));

// Middleware para parsear JSON
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
  res.send('¡Hola desde el servidor!');
});

// Rutas API de ejemplo
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '¡Conexión exitosa entre frontend y backend!',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
});

app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com' },
    { id: 2, name: 'María García', email: 'maria@example.com' },
    { id: 3, name: 'Carlos López', email: 'carlos@example.com' }
  ]);
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  const newUser = {
    id: Date.now(),
    name,
    email,
    createdAt: new Date().toISOString()
  };
  res.status(201).json(newUser);
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});