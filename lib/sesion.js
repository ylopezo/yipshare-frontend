// El front solo hace fetch a /api del mismo sitio. Next lo reenvía al backend (next.config.ts), así el navegador manda la cookie solo.
// La cookie es httpOnly: aquí nunca la leemos, solo dejamos que viaje.

// ===== MODO SIN API =====
// Mientras no exista el backend, estas funciones responden datos de prueba para poder usar el front.
// Para conectar la API: borra este bloque y quita los comentarios del bloque "CON API" de abajo.
const respuestaDePrueba = (datos) => Promise.resolve({ status: 200, datos });

// Escribe "admin" como usuario para entrar como Administrador Global; cualquier otro entra como habitante
export const iniciarSesion = (usuario) =>
    respuestaDePrueba({ usuario: { nombre: usuario, rol: usuario === "admin" ? "admin_global" : "habitante" } });

export const cerrarSesion = () => respuestaDePrueba({});

// Responde admin_global para que RequiereSesion deje ver todas las páginas
export const obtenerPerfil = () => respuestaDePrueba({ usuario: { rol: "admin_global" } });
// ===== FIN MODO SIN API =====

// ===== CON API =====
// // Hace la petición y regresa { status, datos }. status 0 = no se pudo conectar con el servidor.
// export const pedir = async (metodo, ruta, cuerpo) => {
//     try {
//         const respuesta = await fetch(ruta, {
//             method: metodo,
//             credentials: "include",
//             headers: cuerpo ? { "Content-Type": "application/json" } : undefined,
//             body: cuerpo ? JSON.stringify(cuerpo) : undefined,
//         });
//         const datos = await respuesta.json().catch(() => ({}));
//         // 5xx sin mensaje: el proxy de Next no encontró el backend (ECONNREFUSED)
//         if (respuesta.status >= 500 && !datos.error) datos.error = "No se pudo conectar con el servidor.";
//         return { status: respuesta.status, datos };
//     } catch {
//         return { status: 0, datos: { error: "No se pudo conectar con el servidor." } };
//     }
// };
//
// export const iniciarSesion = (usuario, contrasena) => pedir("POST", "/api/login", { usuario, contrasena });
//
// // El servidor destruye la sesión y borra la cookie
// export const cerrarSesion = () => pedir("POST", "/api/logout");
//
// // 200 con el usuario, 401 si no hay sesión o ya expiró
// export const obtenerPerfil = () => pedir("GET", "/api/perfil");
// ===== FIN CON API =====

export const paginaDeInicio = (rol) =>
    rol === "admin_global" ? "/admin_yipshare/principal_page/condominios" : "/habitante_yipshare/principal_page";
