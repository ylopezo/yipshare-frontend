import assert from "node:assert/strict";
import { test } from "node:test";
import { digitsOnly, isPhoneValid } from "./data.js";
import { average } from "./loans.js";

test("digitsOnly quita lo que no es dígito y limita a 10", () => {
    assert.equal(digitsOnly("55-1234 5678"), "5512345678");
    assert.equal(digitsOnly("123456789012"), "1234567890");
});

test("isPhoneValid exige exactamente 10 dígitos", () => {
    assert.equal(isPhoneValid("5512345678"), true);
    assert.equal(isPhoneValid("55123"), false);
    assert.equal(isPhoneValid("55123456ab"), false);
});

test("average de calificaciones", () => {
    assert.equal(average([]), 0);
    assert.equal(average([{ stars: 5 }, { stars: 4 }]), 4.5);
});
