export type Condominio = {
    id: number;
    nombre: string;
    direccion: string;
    cantidad: number;
    admin: string;
};

export type Solicitud = {
    id: number;
    nombre: string;
    direccion: string;
    cantidad: number;
    aspirante: string;
};

export const CONDOMINIOS_INICIALES: Condominio[] = [
    { id: 1, nombre: "Torres del Valle", direccion: "Av. Insurgentes Sur 123, CDMX", cantidad: 48, admin: "Laura Pérez" },
    { id: 2, nombre: "Residencial Los Pinos", direccion: "Calle Pinos 45, Coyoacán", cantidad: 32, admin: "Carlos Ramírez" },
    { id: 3, nombre: "Privada San Miguel", direccion: "Calle San Miguel 8, Tlalpan", cantidad: 16, admin: "Ana Martínez" },
    { id: 4, nombre: "Jardines de Mixcoac", direccion: "Av. Revolución 560, Benito Juárez", cantidad: 60, admin: "Luis Hernández" },
    { id: 5, nombre: "Condominio Reforma 90", direccion: "Paseo de la Reforma 90, Cuauhtémoc", cantidad: 120, admin: "María González" },
    { id: 6, nombre: "Villas del Sol", direccion: "Calle Sol 301, Iztapalapa", cantidad: 24, admin: "Jorge Salinas" },
    { id: 7, nombre: "Lomas Verdes", direccion: "Blvd. Lomas Verdes 77, Naucalpan", cantidad: 40, admin: "Patricia Núñez" },
    { id: 8, nombre: "Hacienda Real", direccion: "Camino Real 12, Xochimilco", cantidad: 18, admin: "Ricardo Díaz" },
];

export const SOLICITUDES_INICIALES: Solicitud[] = [
    { id: 101, nombre: "Residencial Las Palmas", direccion: "Calle Palmas 210, Azcapotzalco", cantidad: 36, aspirante: "Fernanda Ruiz" },
    { id: 102, nombre: "Torre Mirador", direccion: "Av. Universidad 890, Benito Juárez", cantidad: 80, aspirante: "Héctor Solís" },
    { id: 103, nombre: "Privada Los Olivos", direccion: "Calle Olivo 15, Álvaro Obregón", cantidad: 12, aspirante: "Daniela Cruz" },
    { id: 104, nombre: "Condominio Bosques", direccion: "Bosque de Ciruelos 44, Miguel Hidalgo", cantidad: 52, aspirante: "Mauricio Vega" },
    { id: 105, nombre: "Villas Alameda", direccion: "Calle Alameda 7, Gustavo A. Madero", cantidad: 28, aspirante: "Sofía Lara" },
];

export const DOCUMENTOS_EJEMPLO = [
    "Identificación oficial (INE)",
    "Comprobante de domicilio",
    "Acta constitutiva del condominio",
    "Carta de nombramiento como administrador",
];

export const USUARIO_ADMIN = "admin";
export const CONTRASENA_OCULTA = "••••••••";

export const DATOS_PERFIL_PRUEBA = {
    nombres: "Juan",
    apellidoPaterno: "Pérez",
    apellidoMaterno: "Gómez",
    direccion: "Av. Insurgentes Sur 123, CDMX",
    calificacion: 5.0,
    totalCalificaciones: 0,
    username: "mi_usuario",
    rol: "habitante" as const,
};