// Pon el video en public/video/fondo.mp4; si no existe, solo se ve el degradado.
export function FondoVideo() {
    return (
        <video
            src="/video/fondo.mp4"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 h-full w-full object-cover opacity-30 motion-reduce:hidden"
        />
    );
}
