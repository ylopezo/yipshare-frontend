export const average = (cs) => (cs.length === 0 ? 0 : cs.reduce((sum, rating) => sum + rating.stars, 0) / cs.length);

export const DAYS = {
    "1 día": 1,
    "2 días": 2,
    "3 días": 3,
    "1 semana": 7,
    "2 semanas": 14,
    "1 mes": 30,
};

export const CODE_SECONDS = 900;
