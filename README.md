# YipShare (frontend)

## Integrantes del Equipo
Amaro López Jonathan Israel
Fuentes Moreno Luis Antonio
García Delgado Jesús Xavier
López Ortega Yehoshua Leopoldo

Plataforma para que vecinos de un condominio se presten artículos: publican, solicitan, entregan y devuelven con códigos de verificación, y se califican.

## Roles
Habitante, administrador de condominio y Administrador Global.

## Tecnologías
Next.js 16 (App Router), React 19, Tailwind CSS v4.

## Cómo correrlo
    npm install
    npm run dev      # http://localhost:3000
    npm test         # pruebas de lib/
    npm run lint

El front pide `/api/...` y Next lo reenvía al backend. Define `API_URL` en `.env.local` (por defecto `http://localhost:4600`).