const DOT_SPACING = 50;
const DOT_ROWS = 8;
const DOT_COLUMNS = 50;
const PATTERN_HEIGHT = DOT_ROWS * DOT_SPACING;

function DotPattern() {
    const dots = [];
    for (let row = 0; row < DOT_ROWS; row++) {
        const size = 100 * (1 - row / DOT_ROWS);
        for (let column = 0; column < DOT_COLUMNS; column++) {
            dots.push(
                <circle
                    key={`${row}-${column}`}
                    cx={column * DOT_SPACING - 25}
                    cy={PATTERN_HEIGHT - row * DOT_SPACING - 25 + size / 2}
                    r={size / 2}
                />,
            );
        }
    }
    return (
        <svg
            width={DOT_COLUMNS * DOT_SPACING}
            height={PATTERN_HEIGHT}
            className="absolute bottom-0 left-0 fill-[#163a5c]"
        >
            {dots}
        </svg>
    );
}

export function YipBackground({ fixed = false }) {
    return (
        <div
            aria-hidden="true"
            className={`pointer-events-none inset-0 overflow-hidden ${fixed ? "fixed" : "absolute"}`}
        >
            <DotPattern />
            <div className="absolute -left-36 -top-36 h-64 w-64 rounded-full border-[6px] border-white md:-left-44 md:-top-44 md:h-[26rem] md:w-[26rem] md:border-8" />
            <div className="absolute -bottom-32 -right-32 hidden h-80 w-80 rounded-full border-8 border-white lg:block" />
        </div>
    );
}
