import { useCallback, useEffect, useState } from "react";
import {
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import { apiRequest, apiRequestFormData, uploadUrl } from "./session";
import { DAYS } from "./loans";

const DAY_MS = 86_400_000;

const CONDITIONS = {
  excellent: "Excelente estado",
  good: "Buen estado",
  medium: "Estado intermedio",
  bad: "Mal estado",
};
const ARTICLE_STATUS = {
  available: "available",
  pending: "pending",
  not_available: "unavailable",
};
const LOAN_STATUS = {
  pending: "pending",
  accepted: "accepted",
  on_loan: "in_progress",
  returned: "finished",
  rejected: "rejected",
};

const ok = (status) => status >= 200 && status < 300;

export const durationLabel = (days) =>
  Object.keys(DAYS).find((k) => DAYS[k] === days) ?? `${days} días`;

export const runAction = async (request, onDone) => {
  const { status, data } = await request;
  if (!ok(status))
    alert(data.error ?? data.message ?? "No se pudo completar la acción.");
  await onDone?.();
  return ok(status);
};

const toArticle = async (a) => ({
  id: a.articleId,
  name: a.name,
  category: a.category,
  description: a.description,
  condition: CONDITIONS[a.state],
  durations: (a.loanDurations ?? [a.maximumLendTime]).map(durationLabel),
  status: ARTICLE_STATUS[a.availability],
  imagePath: a.image,
  image: await uploadUrl(a.image),
  owner: a.owner,
  rating: a.rating ?? 0,
});

const getArticles = async (condominiumId) => {
  const { status, data } = await apiRequest(
    "GET",
    `/api/condominiums/${condominiumId}/articles`,
  );
  return status === 200 ? Promise.all(data.map(toArticle)) : [];
};

// The back takes the article as multipart (multer), with the photo in the "image" field.
export const saveArticle = (condominiumId, articleId, form) => {
  const days = form.durations.map((d) => DAYS[d]);
  const body = new FormData();
  body.append("name", form.name);
  body.append("category", form.category);
  body.append("description", form.description);
  body.append(
    "state",
    Object.keys(CONDITIONS).find((k) => CONDITIONS[k] === form.condition),
  );
  body.append("maximumLendTime", Math.max(...days));
  days.forEach((d) => body.append("loanDurations", d));
  if (form.file) body.append("image", form.file);
  const route = `/api/condominiums/${condominiumId}/articles`;
  return articleId
    ? apiRequestFormData("PATCH", `${route}/${articleId}`, body)
    : apiRequestFormData("POST", route, body);
};

export const deleteArticle = (condominiumId, articleId) =>
  apiRequest(
    "DELETE",
    `/api/condominiums/${condominiumId}/articles/${articleId}`,
  );

const getMyLoans = async (condominiumId, me) => {
  const { status, data } = await apiRequest(
    "GET",
    `/api/loans/me?condominiumId=${condominiumId}`,
  );
  if (status !== 200) return [];
  return Promise.all(
    data.map(async (l) => ({
      id: l.loanId,
      articleId: l.articleId,
      name: l.articleName,
      image: await uploadUrl(l.image),
      owner: l.lentByMe ? me : l.otherUsername,
      borrower: l.lentByMe ? l.otherUsername : me,
      duration: durationLabel(l.days),
      status: LOAN_STATUS[l.state],
      end: l.startedAt ? Date.parse(l.startedAt) + l.days * DAY_MS : null,
    })),
  );
};

export const getCondominiumLoans = async (condominiumId) => {
  const { status, data } = await apiRequest(
    "GET",
    `/api/condominiums/${condominiumId}/loans`,
  );
  if (status !== 200) return [];
  return data.map((l) => ({
    id: l.loanId,
    articleId: l.articleId,
    name: l.articleName,
    owner: l.lenderUsername,
    borrower: l.borrowerUsername,
    duration: durationLabel(l.days),
    status: LOAN_STATUS[l.state],
    end: l.startedAt ? Date.parse(l.startedAt) + l.days * DAY_MS : null,
  }));
};

export const requestLoan = (articleId, duration) =>
  apiRequest("POST", "/api/loans", {
    articleId,
    requestText: "",
    days: DAYS[duration],
  });

export const respondLoan = (loanId, accept) =>
  apiRequest(
    "PATCH",
    `/api/loans/me/${loanId}/${accept ? "accept" : "reject"}`,
  );

export const generateCode = async (loanId) => {
  const { status, data } = await apiRequest(
    "POST",
    `/api/loans/me/${loanId}/verification-code`,
  );
  if (status !== 200) alert(data.error ?? "No se pudo generar el código.");
  return status === 200 ? data.code : null;
};

export const confirmCode = (loanId, code) =>
  apiRequest("PATCH", `/api/loans/me/${loanId}/confirm`, { code });

const getRatings = async (condominiumId) => {
  const { status, data } = await apiRequest(
    "GET",
    `/api/condominiums/${condominiumId}/reviews`,
  );
  return status === 200 ? data : [];
};

export const rateLoan = ({ loanId, stars, comment }) =>
  apiRequest("POST", "/api/reviews", { loanId, stars, comment });

export function useCondominiumData(condominiumId, me) {
  const [data, setData] = useState({ articles: [], loans: [], ratings: [] });

  const refresh = useCallback(async () => {
    if (!me) return;
    const [articles, loans, ratings] = await Promise.all([
      getArticles(condominiumId),
      getMyLoans(condominiumId, me),
      getRatings(condominiumId),
    ]);
    setData({ articles, loans, ratings });
  }, [condominiumId, me]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- state is set after an await
    refresh();
    // shortcut: polling so the other neighbor's actions show up; use push/websockets if it gets heavy
    const t = setInterval(refresh, 10_000);
    return () => clearInterval(t);
  }, [refresh]);

  return { ...data, refresh };
}

export const getMyProfile = async () => {
  const { status, data } = await apiRequest("GET", "/api/users/me");
  if (status !== 200) return null;
  const phone = parsePhoneNumberFromString(data.phoneNumber ?? "");
  return {
    paternalSurname: data.paternalSurname,
    maternalSurname: data.maternalSurname,
    givenNames: data.name,
    dialCode: phone?.country ?? "MX",
    phone: phone?.nationalNumber ?? "",
  };
};

export const updateMyProfile = (p) =>
  apiRequest("PATCH", "/api/users/me", {
    name: p.givenNames.trim(),
    paternalSurname: p.paternalSurname.trim(),
    maternalSurname: p.maternalSurname.trim(),
    phoneNumber: `+${getCountryCallingCode(p.dialCode)}${p.phone}`,
  });

export const deleteMyAccount = () => apiRequest("DELETE", "/api/users/me");
