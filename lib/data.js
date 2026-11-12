import { getCountries, getCountryCallingCode } from "libphonenumber-js";

export const INITIAL_CONDOMINIUMS = [
    {
        id: 1,
        name: "Torres del Valle",
        address: "Av. Insurgentes Sur 123, CDMX",
        unitCount: 48,
        admin: "Laura Pérez",
    },
    {
        id: 2,
        name: "Residencial Los Pinos",
        address: "Calle Pinos 45, Coyoacán",
        unitCount: 32,
        admin: "Carlos Ramírez",
    },
    {
        id: 3,
        name: "Privada San Miguel",
        address: "Calle San Miguel 8, Tlalpan",
        unitCount: 16,
        admin: "Ana Martínez",
    },
    {
        id: 4,
        name: "Jardines de Mixcoac",
        address: "Av. Revolución 560, Benito Juárez",
        unitCount: 60,
        admin: "Luis Hernández",
    },
    {
        id: 5,
        name: "Condominio Reforma 90",
        address: "Paseo de la Reforma 90, Cuauhtémoc",
        unitCount: 120,
        admin: "María González",
    },
    { id: 6, name: "Villas del Sol", address: "Calle Sol 301, Iztapalapa", unitCount: 24, admin: "Jorge Salinas" },
    {
        id: 7,
        name: "Lomas Verdes",
        address: "Blvd. Lomas Verdes 77, Naucalpan",
        unitCount: 40,
        admin: "Patricia Núñez",
    },
    { id: 8, name: "Hacienda Real", address: "Camino Real 12, Xochimilco", unitCount: 18, admin: "Ricardo Díaz" },
];

export const INITIAL_REQUESTS = [
    {
        id: 101,
        name: "Residencial Las Palmas",
        address: "Calle Palmas 210, Azcapotzalco",
        unitCount: 36,
        applicant: "Fernanda Ruiz",
    },
    {
        id: 102,
        name: "Torre Mirador",
        address: "Av. Universidad 890, Benito Juárez",
        unitCount: 80,
        applicant: "Héctor Solís",
    },
    {
        id: 103,
        name: "Privada Los Olivos",
        address: "Calle Olivo 15, Álvaro Obregón",
        unitCount: 12,
        applicant: "Daniela Cruz",
    },
    {
        id: 104,
        name: "Condominio Bosques",
        address: "Bosque de Ciruelos 44, Miguel Hidalgo",
        unitCount: 52,
        applicant: "Mauricio Vega",
    },
    {
        id: 105,
        name: "Villas Alameda",
        address: "Calle Alameda 7, Gustavo A. Madero",
        unitCount: 28,
        applicant: "Sofía Lara",
    },
];

export const SAMPLE_DOCUMENTS = [
    "Identificación oficial (INE)",
    "Comprobante de domicilio",
    "Acta constitutiva del condominio",
    "Carta de nombramiento como administrador",
];

export const ADMIN_USERNAME = "admin";
export const HIDDEN_PASSWORD = "••••••••";

const countryName = new Intl.DisplayNames(["es"], { type: "region" });

// Todos los países con su lada, ordenados por nombre; el valor es el código ISO (MX, US…) porque +1 lo comparten varios.
export const DIAL_CODES = getCountries()
    .map((country) => ({
        value: country,
        text: `${countryName.of(country)} (+${getCountryCallingCode(country)})`,
    }))
    .sort((a, b) => a.text.localeCompare(b.text, "es"));

export const digitsOnly = (text) => text.replace(/\D/g, "").slice(0, 10);
export const isPhoneValid = (tel) => /^\d{10}$/.test(tel);
