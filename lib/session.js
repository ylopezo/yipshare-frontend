const TOKEN_KEY = "token";
const SESSION_EVENT = "yipshare-session";

const readToken = () => {
    try {
        return localStorage.getItem(TOKEN_KEY);
    } catch {
        return null;
    }
};

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

export const apiRequest = async (method, route, body) => {
    const token = readToken();
    const isFile = body instanceof Blob;
    const headers = {};
    if (body) headers["Content-Type"] = isFile ? body.type : "application/json";
    if (token) headers.Authorization = `Bearer ${token}`;

    try {
        const response = await fetch(route, {
            method: method,
            headers,
            body: body ? (isFile ? body : JSON.stringify(body)) : undefined,
        });
        const data = await response.json().catch(() => ({}));
        if (response.status >= 500 && !data.error) data.error = "No se pudo conectar con el servidor.";
        return { status: response.status, data };
    } catch {
        return {
            status: 0,
            data: { error: "No se pudo conectar con el servidor." },
        };
    }
};

export const apiRequestFormData = async (method, route, body) => {
    const token = readToken();
    const headers = {};
    let requestBody;

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    if (body) {
        if (body instanceof FormData) {
            requestBody = body;
        } else {
            requestBody = new FormData();
            Object.entries(body).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    requestBody.append(key, value);
                }
            });
        }
    }

    try {
        const response = await fetch(route, {
            method,
            headers,
            body: requestBody,
        });

        const data = await response.json().catch(() => ({}));

        if (response.status >= 500 && !data.error) {
            data.error = "No se pudo conectar con el servidor.";
        }

        return { status: response.status, data };
    } catch {
        return {
            status: 0,
            data: { error: "No se pudo conectar con el servidor." },
        };
    }
};

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
    const { status, data } = await apiRequest("POST", "/api/auth/login", {
        username: user,
        password: password,
    });
    if (status !== 200)
        return {
            status,
            data: { error: status === 0 || status >= 500 ? data.error : undefined },
        };
    saveToken(data.token);
    return getProfile();
};

export const registerAction = async (token) => {
    saveToken(token);
    return getProfile();
};

export const signOut = async () => {
    const response = await apiRequest("POST", "/api/auth/logout");
    saveToken(null);
    return response;
};

export const homePage = (role) =>
    role === "global_admin" ? "/admin_yipshare/principal_page/condominios" : "/habitante_yipshare/principal_page";

export const fetchProfile = async () => {
    const { status, data } = await apiRequest("GET", "/api/auth/me");
    if (status !== 200) return { status, data };
    return data;
};
