"use client";

import { useSyncExternalStore } from "react";
import { getError, hideError, subscribeError } from "@/lib/errors";
import { Icon } from "./Icon";

const noError = () => null;

export function ErrorToast() {
    const message = useSyncExternalStore(subscribeError, getError, noError);

    return (
        <div role="alert" className="pointer-events-none fixed inset-x-0 bottom-4 z-55 flex justify-center px-4">
            {message && (
                <div className="pointer-events-auto flex max-w-md items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-sm text-black">
                    <span>{message}</span>
                    <button
                        type="button"
                        aria-label="Cerrar"
                        onClick={hideError}
                        className="cursor-pointer rounded-full p-1 hover:bg-neutral-100"
                    >
                        <Icon name="close" size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}
