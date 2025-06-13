# Facecooding - Next.js Version

Una red social para desarrolladores construida con Next.js, Material UI y Redux Toolkit.

## 🚀 Características

- **Frontend moderno**: Next.js 15 con App Router
- **UI hermosa**: Material UI con tema personalizado
- **State Management**: Redux Toolkit para manejo de estado
- **Autenticación**: Sistema completo de registro y login
- **Formularios**: React Hook Form para validación
- **TypeScript**: Tipado estático para mejor desarrollo
- **Responsive**: Diseño adaptable a todos los dispositivos

## 📦 Dependencias Principales

- **Next.js**: Framework React para producción
- **Material UI**: Componentes de UI listos para usar
- **Redux Toolkit**: State management moderno
- **React Hook Form**: Manejo de formularios performante
- **Axios**: Cliente HTTP
- **TypeScript**: Superset tipado de JavaScript

## 🛠 Instalación

1. **Instalar dependencias**:

   ```bash
   npm install
   ```

2. **Configurar variables de entorno**:
   Crear `.env.local`:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:5001
   ```

3. **Ejecutar en desarrollo**:

   ```bash
   npm run dev
   ```

4. **Construir para producción**:
   ```bash
   npm run build
   npm start
   ```

## 🏗 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── dashboard/         # Dashboard del usuario
│   ├── login/             # Página de login
│   ├── register/          # Página de registro
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página de inicio
├── components/            # Componentes reutilizables
│   ├── layout/           # Componentes de layout
│   └── ProtectedRoute.tsx # Rutas protegidas
├── store/                # Redux store
│   ├── slices/           # Redux slices
│   ├── hooks.ts          # Hooks tipados
│   ├── store.ts          # Configuración del store
│   └── ReduxProvider.tsx # Proveedor de Redux
├── theme/                # Configuración de Material UI
└── utils/                # Utilidades
```

## 🎨 Componentes Principales

### Autenticación

- **Login**: Formulario de inicio de sesión con validación
- **Register**: Formulario de registro con confirmación de contraseña
- **ProtectedRoute**: HOC para proteger rutas privadas

### Dashboard

- **Profile Summary**: Resumen del perfil del usuario
- **Experience**: Lista de experiencias laborales
- **Education**: Lista de educación
- **Skills**: Chips con las habilidades

### Layout

- **Navbar**: Navegación principal con diferentes estados
- **Alert**: Sistema de notificaciones con Snackbar

## 🔧 Redux Store

### Slices disponibles:

- **authSlice**: Manejo de autenticación
- **alertSlice**: Sistema de alertas
- **profileSlice**: Gestión de perfiles
- **postSlice**: Manejo de posts

## 🔗 API Integration

El proyecto está configurado para conectarse con el backend Express.js existente:

- Base URL: `http://localhost:3000`
- Proxy configurado en `next.config.js`
- Axios interceptors para autenticación

## 📱 Páginas Disponibles

- `/`: Landing page
- `/login`: Iniciar sesión
- `/register`: Registrarse
- `/dashboard`: Dashboard del usuario (protegido)

## 🚦 Scripts Disponibles

- `npm run dev`: Desarrollo con Turbopack
- `npm run build`: Construir para producción
- `npm run start`: Ejecutar en producción
- `npm run lint`: Ejecutar ESLint
