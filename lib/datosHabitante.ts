export type CondominioUsuario = {
    id: number;
    nombre: string;
    admin: string;
};

export const REGISTRADOS_INICIALES: CondominioUsuario[] = [
    { id: 1, nombre: "Torres del Valle", admin: "mi_usuario" },
    { id: 2, nombre: "Residencial Los Pinos", admin: "mi_usuario" },
];

export const UNIDOS_INICIALES: CondominioUsuario[] = [
    { id: 3, nombre: "Privada San Miguel", admin: "ana_martinez" },
];

export const NOMBRE_USUARIO = "[Nombre]";
