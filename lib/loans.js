export const average = (cs) => (cs.length === 0 ? 0 : cs.reduce((sum, c) => sum + c.stars, 0) / cs.length);

export const DAYS = {
    "1 día": 1,
    "2 días": 2,
    "3 días": 3,
    "1 semana": 7,
    "2 semanas": 14,
    "1 mes": 30,
};

export const CODE_SECONDS = 300;

export function newCode(now) {
    const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000;
    return {
        value: String(n).padStart(6, "0"),
        expiresAt: now + CODE_SECONDS * 1000,
    };
}

export const isCodeValid = (c, written, now) => written.trim() === c.value && now < c.expiresAt;

export function advance(p, now) {
    if (p.status === "accepted")
        return {
            ...p,
            status: "in_progress",
            end: now + DAYS[p.duration] * 86_400_000,
        };
    if (p.status === "in_progress") return { ...p, status: "finished" };
    return p;
}
