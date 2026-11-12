// Pruebas de las reglas de los préstamos. Se corren con: npm test
import assert from "node:assert/strict";
import { test } from "node:test";
import { advance, isCodeValid, DAYS, newCode, CODE_SECONDS } from "./loans.js";

const NOW = Date.parse("2026-11-09T12:00:00");
const loan = { id: 1, duration: "1 semana", status: "accepted", end: null };

test("al entregar, el préstamo pasa a en_curso y vence en ahora + duración", () => {
    const delivered = advance(loan, NOW);
    assert.equal(delivered.status, "in_progress");
    assert.equal(delivered.end, NOW + 7 * 86_400_000);
});

test("al devolver, el préstamo pasa a finalizado y conserva su fecha", () => {
    const delivered = advance(loan, NOW);
    const returned = advance(delivered, NOW + 86_400_000);
    assert.equal(returned.status, "finished");
    assert.equal(returned.end, delivered.end);
});

test("un préstamo pendiente o rechazado no avanza", () => {
    for (const status of ["pending", "rejected", "finished"]) {
        const p = { ...loan, status };
        assert.equal(advance(p, NOW), p);
    }
});

test("cada duración del formulario tiene días", () => {
    for (const days of Object.values(DAYS)) assert.ok(Number.isInteger(days) && days > 0);
});

test("el código sirve antes de vencer y deja de servir después", () => {
    const code = newCode(NOW);
    assert.match(code.value, /^\d{6}$/);
    assert.ok(isCodeValid(code, ` ${code.value} `, NOW));
    assert.ok(!isCodeValid(code, code.value, NOW + CODE_SECONDS * 1000));
    assert.ok(!isCodeValid(code, "000000" === code.value ? "111111" : "000000", NOW));
});
