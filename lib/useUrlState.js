import { useSearchParams } from "next/navigation";

let pending = null;

function writeParam(name, value, initial) {
    if (!pending) {
        pending = new URLSearchParams(window.location.search);
        queueMicrotask(() => {
            const query = pending.toString();
            pending = null;
            if (`?${query}` === window.location.search || (!query && !window.location.search)) return;
            window.history.pushState(null, "", query ? `?${query}` : window.location.pathname);
        });
    }
    if (value === initial || value === null) pending.delete(name);
    else pending.set(name, value);
}

export function useUrlState(name, initial) {
    const value = useSearchParams().get(name) ?? initial;
    return [value, (next) => writeParam(name, next, initial)];
}
