"use client";

const DOTS = 12;
const DURATION_MS = 1200;

export function LoadingScreen() {
    return (
        <div
            role="status"
            aria-live="polite"
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/40"
        >
            <div aria-hidden="true" className="relative h-14 w-14">
                {Array.from({ length: DOTS }, (_, index) => (
                    <span
                        key={index}
                        className="loading-dot absolute left-1/2 top-0 -ml-1 h-2 w-2 rounded-full bg-white"
                        style={{
                            transform: `rotate(${(360 / DOTS) * index}deg)`,
                            transformOrigin: "50% 28px",
                            animationDelay: `${(DURATION_MS / DOTS) * index - DURATION_MS}ms`,
                        }}
                    />
                ))}
            </div>
            <span className="sr-only">Cargando…</span>
        </div>
    );
}
