# Facecooding

Red Social para developers - **Ahora con Next.js 15 y Material UI**

## 🚀 Nuevo Frontend con Next.js

El proyecto ha sido completamente actualizado con tecnologías modernas:
- **Next.js 15** con App Router
- **Material UI** para una interfaz elegante
- **TypeScript** para mejor desarrollo
- **Redux Toolkit** para state management
- **React Hook Form** para formularios eficientes

## Comenzando 🚀

Clona el repositorio

### Pre-requisitos 📋

- **Node.js** (versión 18 o superior)
- **MongoDB** para la base de datos
- **npm** o **yarn** para gestión de paquetes

### Instalación 🔧

1. **Instala las dependencias del backend**:
```bash
npm install
```

2. **Instala las dependencias del frontend**:
```bash
cd client
npm install
```

3. **Configuración del Backend**:
Crea un archivo `default.json` en la carpeta `config/` con las variables de entorno:
```json
{
  "mongoURI": "tu_mongodb_connection_string",
  "jwtSecret": "tu_jwt_secret_key",
  "githubToken": "tu_github_token_opcional"
}
```

4. **Configuración del Frontend**:
Crea un archivo `.env.local` en la carpeta `client/`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🚀 Ejecutando el Proyecto

### Opción 1: Ejecutar ambos entornos juntos (desde la raíz)
```bash
npm run dev
```

### Opción 2: Ejecutar por separado

**Backend** (desde la raíz):
```bash
npm run server
```

**Frontend** (desde client/):
```bash
cd client
npm run dev
```

El frontend estará disponible en: `http://localhost:3000`
El backend estará disponible en: `http://localhost:5000`

## 🛠️ Tecnologías Utilizadas

### Backend:
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **Bcrypt** - Encriptación de contraseñas

### Frontend (Nuevo):
- **Next.js 15** - Framework React con App Router
- **React 19** - Biblioteca de UI
- **TypeScript** - Superset tipado de JavaScript
- **Material UI** - Biblioteca de componentes
- **Redux Toolkit** - State management
- **React Hook Form** - Manejo de formularios
- **Axios** - Cliente HTTP

### Frontend (Anterior - Removido):
- ~~React~~
- ~~React Redux~~
- ~~CSS vanilla~~

## 📱 Características Implementadas

### ✅ Completado:
- 🔐 Sistema de autenticación completo (Login/Register)
- 🏠 Landing page moderna con gradientes
- 📊 Dashboard de usuario
- 👤 Gestión de perfiles
- 🎨 Interfaz moderna con Material UI
- 📱 Diseño completamente responsive
- 🔧 TypeScript para mejor desarrollo

### 🚧 En desarrollo:
- 📝 Sistema de posts
- � Comentarios
- 👥 Perfiles públicos
- 🔍 Búsqueda de desarrolladores

## 👥 Autores

**Edgar Chavero** - Desarrollo inicial y migración a Next.js

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

MIT





