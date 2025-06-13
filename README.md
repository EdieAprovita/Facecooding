# Facecooding - Full Stack Application

Una aplicación web completa para una red social de cocina con autenticación JWT, construida con TypeScript.

## 🏗️ Arquitectura del Proyecto

El proyecto está dividido en dos carpetas principales:

```
Facecooding/
├── backend/          # API REST con Express + TypeScript
├── frontend/         # Cliente con Next.js + React
├── package.json      # Scripts para manejar todo el proyecto
└── README.md
```

## 🚀 Tecnologías

### Backend

- **Node.js** + **Express.js** con **TypeScript**
- **MongoDB** con **Mongoose**
- **JWT** para autenticación
- **bcryptjs** para hash de contraseñas
- **express-validator** para validación
- **helmet**, **cors**, **rate-limiting** para seguridad
- **Jest** para testing

### Frontend

- **Next.js 15** con **App Router**
- **React 19** con **TypeScript**
- **Material-UI** para componentes
- **Redux Toolkit** para manejo de estado
- **Axios** para peticiones HTTP

## 📦 Instalación

### Instalación completa (Recomendado)

```bash
# Instalar todas las dependencias
npm run install:all
```

### Instalación individual

```bash
# Instalar dependencias del proyecto principal
npm install

# Instalar dependencias del backend
cd backend && npm install

# Instalar dependencias del frontend
cd frontend && npm install
```

## 🔧 Configuración

### Backend

1. Copia las variables de entorno:

```bash
# En la raíz del proyecto, crea un archivo .env para el backend
cp .env.backend.example backend/.env
```

2. Configura las variables de entorno en `backend/.env`:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/facecooding
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### Frontend

1. Configura las variables de entorno en `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 🏃‍♂️ Uso

### Desarrollo (Full Stack)

```bash
# Ejecutar backend y frontend simultáneamente
npm run dev
```

### Desarrollo Individual

```bash
# Solo backend (Puerto 3000)
npm run dev --prefix backend

# Solo frontend (Puerto 5001)
npm run dev --prefix frontend
```

### Producción

```bash
# Construir todo el proyecto
npm run build

# Iniciar en producción (solo backend)
npm start
```

## 📁 Estructura del Backend

```
backend/
├── src/
│   ├── config/          # Configuraciones (DB, entorno)
│   ├── controllers/     # Controladores de rutas
│   ├── middleware/      # Middleware personalizado
│   ├── models/          # Modelos de MongoDB
│   ├── routes/          # Definición de rutas
│   ├── services/        # Lógica de negocio
│   ├── types/           # Tipos de TypeScript
│   ├── utils/           # Utilidades
│   ├── validators/      # Validadores de entrada
│   ├── app.ts           # Configuración de Express
│   └── server.ts        # Punto de entrada
├── dist/                # Código compilado
├── package.json
├── tsconfig.json
└── nodemon.json
```

## 🔐 API de Autenticación

### Endpoints Públicos

```http
POST /api/auth/register  # Registrar usuario
POST /api/auth/login     # Iniciar sesión
```

### Endpoints Privados

```http
GET    /api/auth/me               # Obtener usuario actual
PUT    /api/auth/profile          # Actualizar perfil
PUT    /api/auth/change-password  # Cambiar contraseña
DELETE /api/auth/account          # Eliminar cuenta
```

### Endpoints de Admin

```http
GET /api/auth/stats    # Estadísticas de usuarios
GET /api/auth/search   # Buscar usuarios
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev                 # Ejecutar full stack
npm run dev --prefix backend    # Solo backend
npm run dev --prefix frontend   # Solo frontend

# Construcción
npm run build              # Construir todo
npm run build:backend      # Construir solo backend
npm run build:frontend     # Construir solo frontend

# Testing
npm run test               # Tests de todo el proyecto
npm run test:backend       # Tests del backend
npm run test:frontend      # Tests del frontend

# Utilidades
npm run clean              # Limpiar archivos generados
npm run lint               # Linting completo
npm run install:all        # Instalar todas las dependencias
```

## 🔒 Seguridad Implementada

- **JWT** para autenticación stateless
- **bcryptjs** para hash de contraseñas (12 rounds)
- **Helmet** para headers de seguridad
- **Rate limiting** para prevenir ataques
- **CORS** configurado apropiadamente
- **Express Validator** para validación de entrada
- **MongoDB sanitization** contra inyección NoSQL

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm run test

# Tests en modo watch
npm run test:watch --prefix backend
```

## 📊 Monitoreo

- Health check endpoint: `GET /health`
- API info endpoint: `GET /api`

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Edgar Chavero**

---

## 🚀 Próximas Características

- [ ] Sistema de perfiles de usuario
- [ ] CRUD de posts/recetas
- [ ] Sistema de comentarios y likes
- [ ] Upload de imágenes
- [ ] Notificaciones en tiempo real
- [ ] API de búsqueda avanzada
- [ ] Tests de integración completos
- [ ] Documentación con Swagger
- [ ] Docker containerization
- [ ] CI/CD pipeline
