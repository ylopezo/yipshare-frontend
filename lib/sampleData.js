export const ME = "mi_usuario";

export const SAMPLE_PROFILE = {
    paternalSurname: "Pérez",
    maternalSurname: "López",
    givenNames: "Juan Carlos",
    building: "Edificio 2",
    apartment: "Departamento 14",
    dialCode: "MX",
    phone: "5512345678",
    rating: 4.2,
};

export const SAMPLE_NEIGHBORS = [
    {
        id: 1,
        name: "Ana Martínez",
        user: "vecino_ana",
        unit: "Edificio 1, Dpto 3",
        upToDate: true,
    },
    {
        id: 2,
        name: "Luis Hernández",
        user: "vecino_luis",
        unit: "Edificio 1, Dpto 8",
        upToDate: true,
    },
    {
        id: 3,
        name: "Marta Ruiz",
        user: "vecino_marta",
        unit: "Edificio 3, Dpto 5",
        upToDate: false,
    },
];

export const SAMPLE_APPLICANTS = [
    {
        id: 10,
        name: "Pedro Sánchez",
        user: "vecino_pedro",
        unit: "Edificio 2, Dpto 6",
    },
    {
        id: 11,
        name: "Laura Gómez",
        user: "vecino_laura",
        unit: "Edificio 4, Dpto 12",
    },
];

export const SAMPLE_ARTICLES = [
    {
        id: 101,
        name: "Taladro",
        category: "Herramientas",
        description: "Taladro inalámbrico con juego de brocas.",
        condition: "Buen estado",
        durations: ["1 día", "2 días"],
        status: "available",
        image: null,
        owner: "vecino_ana",
        address: "Edificio 1, Departamento 3",
        rating: 4.5,
    },
    {
        id: 102,
        name: "Escalera",
        category: "Herramientas",
        description: "Escalera de aluminio de 3 metros.",
        condition: "Excelente estado",
        durations: ["1 día", "3 días"],
        status: "available",
        image: null,
        owner: "vecino_luis",
        address: "Edificio 1, Departamento 8",
        rating: 3.8,
    },
];

export const loan = (id, name, owner, borrower, duration, status, end = null) => ({
    id,
    articleId: -id,
    name,
    image: null,
    owner,
    borrower,
    duration,
    status,
    end: end && Date.parse(end),
});

export const SAMPLE_LOANS = [
    loan(1, "Taladro percutor inalámbrico Bosch 18V", "vecino_ana", ME, "2 días", "pending"),
    loan(2, "Escalera de tijera de aluminio, 3 m", ME, "vecino_luis", "1 día", "pending"),
    loan(3, "Bocina JBL Charge 5", "vecino_marta", ME, "3 días", "accepted"),
    loan(4, "Podadora eléctrica Truper", ME, "vecino_pedro", "1 semana", "accepted"),
    loan(5, "Carpa plegable 3 × 3 m", "vecino_ana", "vecino_luis", "1 día", "in_progress", "2026-11-06T12:00"),
    loan(6, "Bicicleta de montaña R26", "vecino_marta", "vecino_ana", "2 días", "finished", "2026-11-02T12:00"),
    loan(7, "Hidrolavadora Kärcher K2", "vecino_luis", "vecino_marta", "1 semana", "in_progress", "2026-11-14T18:00"),
];

export const SAMPLE_PEOPLE = Object.fromEntries(
    [
        ...SAMPLE_NEIGHBORS,
        ...SAMPLE_APPLICANTS,
        {
            user: ME,
            name: `${SAMPLE_PROFILE.givenNames} ${SAMPLE_PROFILE.paternalSurname}`,
            unit: "Edificio 2, Dpto 14",
        },
    ].map((v) => [v.user, { name: v.name, unit: v.unit }]),
);

export const SAMPLE_RATINGS = [
    {
        loanId: 90,
        from: "vecino_ana",
        to: ME,
        stars: 5,
        comment: "Muy puntual y el artículo llegó en perfecto estado.",
    },
    { loanId: 91, from: "vecino_luis", to: ME, stars: 4, comment: "" },
];
