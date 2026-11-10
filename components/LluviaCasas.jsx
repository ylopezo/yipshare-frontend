"use client";

import { useState } from "react";

const IMAGENES_CASAS = ["/img/logo_yipshare_icono.png", "/img/lavadora.png", "/img/martillo2.png", "/img/tijeras2.png"];

const CANTIDAD = 18;

function generarCasas() {
    return Array.from({ length: CANTIDAD }, (_, i) => {
        const tamano = 20 + Math.random() * 40;

        return {
            id: i,
            imagen: IMAGENES_CASAS[Math.floor(Math.random() * IMAGENES_CASAS.length)],
            style: {
                left: `${Math.random() * 100}vw`,
                width: `${tamano}px`,
                height: `${tamano}px`,
                animationDuration: `${8 + Math.random() * 10}s`,
                animationDelay: `${-Math.random() * 15}s`,
                "--op": (0.08 + Math.random() * 0.22).toFixed(2),
                "--giro": `${Math.random() * 360 - 180}deg`,
            },
        };
    });
}

// Se importa con next/dynamic y ssr: false: los números al azar solo se generan en el navegador y no hay error de hidratación
export default function LluviaCasas() {
    const [casas] = useState(generarCasas);

    return (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
            {casas.map((casa) => (
                <div key={casa.id} className="casa" style={casa.style}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={casa.imagen} alt="" className="h-full w-full object-contain" />
                </div>
            ))}
        </div>
    );
}
