const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3001;

// Configurar CORS
app.use(cors({
  origin: 'http://localhost:3000', // Permitir peticiones desde el frontend
  credentials: true
}));

// Middleware para parsear JSON
app.use(express.json());

// JWT Secret (en producción debería estar en variables de entorno)
const JWT_SECRET = 'tu-jwt-secret-super-seguro';

// Datos de ejemplo para usuarios (en producción usar base de datos)
const usuarios = [
  {
    id: '1',
    email: 'admin@peritos.com',
    password: 'admin123', // En producción usar hash
    nombre: 'Administrador',
    apellido: 'Sistema',
    rol: 'administrador',
    activo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2', 
    email: 'coordinador@peritos.com',
    password: 'coord123',
    nombre: 'María',
    apellido: 'Coordinadora',
    rol: 'coordinador',
    activo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    email: 'perito@peritos.com', 
    password: 'perito123',
    nombre: 'Juan',
    apellido: 'Perito',
    rol: 'perito',
    activo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Middleware para verificar token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token de acceso requerido'
    });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

// Ruta principal
app.get('/', (req, res) => {
  res.send('¡Servidor API Peritos funcionando!');
});

// RUTAS DE AUTENTICACIÓN

// Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validar que se enviaron los datos requeridos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }
    
    // Buscar usuario
    const usuario = usuarios.find(u => u.email === email && u.password === password);
    
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    if (!usuario.activo) {
      return res.status(401).json({
        success: false,
        message: 'Usuario desactivado'
      });
    }
    
    // Generar token
    const token = jwt.sign(
      { 
        userId: usuario.id,
        email: usuario.email,
        rol: usuario.rol
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Remover password de la respuesta
    const { password: _, ...usuarioSinPassword } = usuario;
    
    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: usuarioSinPassword,
        token: token
      }
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener perfil del usuario autenticado
app.get('/api/auth/profile', verifyToken, (req, res) => {
  try {
    const usuario = usuarios.find(u => u.id === req.user.userId);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    const { password: _, ...usuarioSinPassword } = usuario;
    
    res.json({
      success: true,
      data: usuarioSinPassword
    });
    
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Logout (opcional - para invalidar tokens en el servidor)
app.post('/api/auth/logout', verifyToken, (req, res) => {
  res.json({
    success: true,
    message: 'Logout exitoso'
  });
});

// RUTAS DE PRUEBA
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '¡Conexión exitosa entre frontend y backend!',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
});

app.get('/api/users', verifyToken, (req, res) => {
  const usuariosSinPassword = usuarios.map(({ password, ...usuario }) => usuario);
  res.json({
    success: true,
    data: usuariosSinPassword
  });
});

app.post('/api/users', verifyToken, (req, res) => {
  const { name, email } = req.body;
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    createdAt: new Date().toISOString()
  };
  res.status(201).json({
    success: true,
    data: newUser
  });
});

app.listen(port, () => {
  console.log(`🚀 Servidor API Peritos escuchando en http://localhost:${port}`);
  console.log('📝 Usuarios de prueba:');
  console.log('   admin@peritos.com / admin123 (Administrador)');
  console.log('   coordinador@peritos.com / coord123 (Coordinador)');  
  console.log('   perito@peritos.com / perito123 (Perito)');
});