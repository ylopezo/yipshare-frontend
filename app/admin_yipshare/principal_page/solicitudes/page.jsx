"use client";

import { useMemo, useState } from "react";
import { DocumentsModal } from "@/components/DocumentsModal";
import { ConfirmDialog } from "@/components/Modal";
import { useAdmin } from "../AdminContext";

const COLUMNS = ["Nombre", "Dirección", "Documentos", "Admin. Condominio"];
const GRID = "grid grid-cols-[repeat(4,minmax(0,1fr))_6rem] gap-2";

export default function RequestsPage() {
  const { requests, searchQuery, acceptRequest, denyRequest } = useAdmin();
  const [viewDocuments, setViewDocuments] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  const filtered = useMemo(() => {
    const text = searchQuery.trim().toLowerCase();
    if (!text) return requests;

    return requests.filter(({ name, address, applicant }) => {
      const nameLower = name.toLowerCase();
      const dir = address.toLowerCase();
      const applicantText = applicant.toLowerCase();
      return (
        nameLower.includes(text) ||
        dir.includes(text) ||
        applicantText.includes(text)
      );
    });
  }, [searchQuery, requests]);

  return (
    <>
      <h2 className="m-0 text-lg font-bold">Solicitudes de Condominios</h2>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="sticky top-0 z-10 bg-fondo px-4 pb-3">
          <div className={`${GRID} text-center text-xs font-bold md:text-sm`}>
            {COLUMNS.map((column) => (
              <span key={column}>{column}</span>
            ))}
            <span aria-hidden="true" />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">
            {requests.length === 0
              ? "No hay solicitudes pendientes."
              : "No se encontraron solicitudes."}
          </p>
        ) : (
          <ul className="m-0 list-none space-y-3 p-0 pb-2">
            {filtered.map((request) => (
              <li
                key={request.id}
                className="rounded-xl border border-slate-400 bg-white px-4 py-3"
              >
                <div
                  className={`${GRID} items-center text-center text-[11px] md:text-xs`}
                >
                  <span className="wrap-break-word">{request.name}</span>
                  <span className="wrap-break-word">{request.address}</span>

                  <button
                    type="button"
                    onClick={() => setViewDocuments(request)}
                    className="cursor-pointer text-[11px] font-semibold uppercase text-azul-claro hover:underline md:text-xs"
                  >
                    Ver documentos
                  </button>

                  <span className="break-words">{request.applicant}</span>

                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmation({ action: "accept", request })
                      }
                      className="w-full cursor-pointer rounded-full bg-azul py-0.5 text-[11px] text-white transition hover:bg-azul-claro"
                    >
                      Aceptar
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmation({ action: "deny", request })
                      }
                      className="w-full cursor-pointer rounded-full border border-azul bg-white py-0.5 text-[11px] text-azul transition hover:bg-slate-100"
                    >
                      Denegar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {viewDocuments && (
        <DocumentsModal
          request={viewDocuments}
          onCloseAction={() => setViewDocuments(null)}
        />
      )}

      {confirmation && (
        <ConfirmDialog
          title="¿Estás seguro?"
          message={
            confirmation.action === "accept"
              ? `Se aceptará el condominio «${confirmation.request.name}» y ${confirmation.request.applicant} será su administrador.`
              : `Se denegará la solicitud del condominio «${confirmation.request.name}».`
          }
          onConfirmAction={() => {
            if (confirmation.action === "accept") {
              acceptRequest(confirmation.request);
            } else {
              denyRequest(confirmation.request.id);
            }
            setConfirmation(null);
          }}
          onCancelAction={() => setConfirmation(null)}
        />
      )}
    </>
  );
}
