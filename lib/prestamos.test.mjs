// Pruebas de las reglas de los préstamos. Se corren con: npm test
import assert from "node:assert/strict";
import { test } from "node:test";
import { avanzar, codigoValido, DIAS, nuevoCodigo, SEGUNDOS_CODIGO } from "./prestamos.js";

const AHORA = Date.parse("2026-11-09T12:00:00");
const prestamo = { id: 1, tiempo: "1 semana", estado: "aceptado", fin: null };

test("al entregar, el préstamo pasa a en_curso y vence en ahora + duración", () => {
    const entregado = avanzar(prestamo, AHORA);
    assert.equal(entregado.estado, "en_curso");
    assert.equal(entregado.fin, AHORA + 7 * 86_400_000);
});

test("al devolver, el préstamo pasa a finalizado y conserva su fecha", () => {
    const entregado = avanzar(prestamo, AHORA);
    const devuelto = avanzar(entregado, AHORA + 86_400_000);
    assert.equal(devuelto.estado, "finalizado");
    assert.equal(devuelto.fin, entregado.fin);
});

test("un préstamo pendiente o rechazado no avanza", () => {
    for (const estado of ["pendiente", "rechazado", "finalizado"]) {
        const p = { ...prestamo, estado };
        assert.equal(avanzar(p, AHORA), p);
    }
});

test("cada duración del formulario tiene días", () => {
    for (const dias of Object.values(DIAS)) assert.ok(Number.isInteger(dias) && dias > 0);
});

test("el código sirve antes de vencer y deja de servir después", () => {
    const codigo = nuevoCodigo(AHORA);
    assert.match(codigo.valor, /^\d{6}$/);
    assert.ok(codigoValido(codigo, ` ${codigo.valor} `, AHORA));
    assert.ok(!codigoValido(codigo, codigo.valor, AHORA + SEGUNDOS_CODIGO * 1000));
    assert.ok(!codigoValido(codigo, "000000" === codigo.valor ? "111111" : "000000", AHORA));
});
