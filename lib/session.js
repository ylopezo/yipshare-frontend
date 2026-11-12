// El front solo hace fetch a /api del mismo sitio. Next lo reenvía al backend (next.config.ts).
// El backend autentica con "Authorization: Bearer <token>" (igual que la app móvil), así que el token se guarda aquí.

const TOKEN_KEY = "token";
const SESSION_EVENT = "yipshare-session";

const readToken = () => {
    try {
        return localStorage.getItem(TOKEN_KEY);
    } catch {
        return null;
    }
};

// Mismo atributo que pone SESSION_SCRIPT antes de pintar; globals.css lo usa para ocultar páginas públicas o privadas
export const markSession = (hasSession) => document.documentElement.toggleAttribute("data-has-session", hasSession);

export const SESSION_SCRIPT = `try{if(localStorage.getItem("${TOKEN_KEY}"))document.documentElement.setAttribute("data-has-session","")}catch(e){}`;

const saveToken = (token) => {
    try {
        if (token) localStorage.setItem(TOKEN_KEY, token);
        else localStorage.removeItem(TOKEN_KEY);
    } catch {}
    markSession(Boolean(token));
    window.dispatchEvent(new Event(SESSION_EVENT));
};

// Para useSyncExternalStore: avisa cuando el token cambia en esta pestaña o en otra
export const subscribeSession = (notify) => {
    window.addEventListener(SESSION_EVENT, notify);
    window.addEventListener("storage", notify);
    return () => {
        window.removeEventListener(SESSION_EVENT, notify);
        window.removeEventListener("storage", notify);
    };
};

export const hasStoredSession = () => Boolean(readToken());

export const forgetSession = () => saveToken(null);

// Hace la petición y regresa { status, datos }. status 0 = no se pudo conectar con el servidor.
export const apiRequest = async (method, route, body) => {
    const token = readToken();
    const headers = {};
    if (body) headers["Content-Type"] = "application/json";
    if (token) headers.Authorization = `Bearer ${token}`;

    try {
        const response = await fetch(route, {
            method: method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });
        const data = await response.json().catch(() => ({}));
        // 5xx sin mensaje: el proxy de Next no encontró el backend (ECONNREFUSED)
        if (response.status >= 500 && !data.error) data.error = "No se pudo conectar con el servidor.";
        return { status: response.status, data };
    } catch {
        return { status: 0, data: { error: "No se pudo conectar con el servidor." } };
    }
};

// 200 con { usuario: { nombre, usuario, rol } }; cualquier otro status si no hay sesión o ya expiró
export const getProfile = async () => {
    const { status, data } = await apiRequest("GET", "/api/auth/me");
    if (status !== 200) return { status, data };
    return {
        status,
        data: {
            user: {
                name: data.name,
                username: data.username,
                role: data.isGlobalAdmin ? "global_admin" : "resident",
            },
        },
    };
};

export const signIn = async (user, password) => {
    const { status, data } = await apiRequest("POST", "/api/auth/login", { username: user, password: password });
    // Los errores del backend vienen en inglés; el login muestra su propio mensaje en español
    if (status !== 200) return { status, data: { error: status === 0 || status >= 500 ? data.error : undefined } };
    saveToken(data.token);
    return getProfile();
};

export const signOut = async () => {
    const response = await apiRequest("POST", "/api/auth/logout");
    saveToken(null);
    return response;
};

export const homePage = (role) =>
    role === "global_admin" ? "/admin_yipshare/principal_page/condominios" : "/habitante_yipshare/principal_page";
