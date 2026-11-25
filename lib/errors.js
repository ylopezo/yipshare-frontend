let message = null;
let timer = null;
const listeners = new Set();

const emit = () => listeners.forEach((listener) => listener());

export function showError(text) {
    message = text;
    clearTimeout(timer);
    timer = setTimeout(hideError, 6000);
    emit();
}

export function hideError() {
    message = null;
    emit();
}

export const getError = () => message;

export function subscribeError(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}
