export type IconName = "house" | "bell" | "logout" | "search" | "user" | "close" | "file" | "plus" | "calendar" |  "alert" | "arrow" ;

export function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
    const paths: Record<IconName, React.ReactNode> = {
        house: <><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h5v-6h4v6h5V10" /></>,
        bell: <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />,
        logout: <path d="M10 5H5v14h5M14 8l4 4-4 4M18 12H9" />,
        search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
        arrow: <path d="M19 12H5M11 6l-6 6 6 6" />,
        user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></>,
        close: <path d="M6 6l12 12M18 6 6 18" />,
        plus: <path d="M12 5v14M5 12h14" />,
        file: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></>,
        calendar: <><path d="M3 4h18v16H3z" /><path d="M3 8h18M3 12h18M3 16h18" /></>,
        alert: <><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></>,
    };

    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
