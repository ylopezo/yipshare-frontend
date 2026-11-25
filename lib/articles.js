import { useCallback, useEffect, useState } from "react";
import { getCountryCallingCode, parsePhoneNumberFromString } from "libphonenumber-js";
import { getMyCondominiums } from "./condominiums";
import { apiRequest, apiRequestFormData, fileUrl, uploadUrl } from "./session";
import { DAYS } from "./loans";
import { showError } from "./errors";

const DAY_MS = 86_400_000;

const CONDITIONS = {
    excellent: "Excelente estado",
    good: "Buen estado",
    medium: "Estado intermedio",
    bad: "Mal estado",
};

const ok = (status) => status >= 200 && status < 300;

export const durationLabel = (days) => Object.keys(DAYS).find((label) => DAYS[label] === days) ?? `${days} días`;

export const runAction = async (request, onDone) => {
    const { status, data } = await request;
    if (!ok(status)) showError(data.error ?? data.message ?? "No se pudo completar la acción.");
    await onDone?.();
    return ok(status);
};

const toArticle = async (article) => ({
    id: article.articleId,
    name: article.name,
    category: article.category,
    description: article.description,
    condition: CONDITIONS[article.state],
    durations: (article.loanDurations ?? [article.maximumLendTime]).map(durationLabel),
    status: article.availability,
    imagePath: article.image,
    image: await uploadUrl(article.image),
    owner: article.owner,
    rating: article.rating ?? 0,
});

const getArticles = async (condominiumId) => {
    const { status, data } = await apiRequest("GET", `/api/condominiums/${condominiumId}/articles`);
    return status === 200 ? Promise.all(data.map(toArticle)) : [];
};

export const saveArticle = (condominiumId, articleId, form) => {
    const days = form.durations.map((label) => DAYS[label]);
    const body = new FormData();
    body.append("name", form.name);
    body.append("category", form.category);
    body.append("description", form.description);
    body.append(
        "state",
        Object.keys(CONDITIONS).find((key) => CONDITIONS[key] === form.condition),
    );
    body.append("maximumLendTime", Math.max(...days));
    days.forEach((day) => body.append("loanDurations", day));
    if (form.file) body.append("image", form.file);
    const route = `/api/condominiums/${condominiumId}/articles`;
    return articleId
        ? apiRequestFormData("PATCH", `${route}/${articleId}`, body)
        : apiRequestFormData("POST", route, body);
};

export const getMyReviews = async () => {
    const { status, data } = await apiRequest("GET", "/api/reviews/me");

    if (status !== 200) {
        return [];
    }

    return data;
};

export const deleteArticle = (condominiumId, articleId) =>
    apiRequest("DELETE", `/api/condominiums/${condominiumId}/articles/${articleId}`);

const getMyLoans = async (condominiumId, me) => {
    const { status, data } = await apiRequest("GET", `/api/loans/me?condominiumId=${condominiumId}`);
    if (status !== 200) return [];
    return Promise.all(
        data.map(async (loan) => ({
            id: loan.loanId,
            articleId: loan.articleId,
            name: loan.articleName,
            image: await uploadUrl(loan.image),
            owner: loan.lentByMe ? me : loan.otherUsername,
            borrower: loan.lentByMe ? loan.otherUsername : me,
            otherUserId: loan.otherUserId,
            duration: durationLabel(loan.days),
            status: loan.state,
            end: loan.startedAt ? Date.parse(loan.startedAt) + loan.days * DAY_MS : null,
        })),
    );
};

export const getCondominiumLoans = async (condominiumId) => {
    const { status, data } = await apiRequest("GET", `/api/condominiums/${condominiumId}/loans`);
    if (status !== 200) return [];
    return data.map((loan) => ({
        id: loan.loanId,
        articleId: loan.articleId,
        name: loan.articleName,
        owner: loan.lenderUsername,
        borrower: loan.borrowerUsername,
        duration: durationLabel(loan.days),
        status: loan.state,
        end: loan.startedAt ? Date.parse(loan.startedAt) + loan.days * DAY_MS : null,
    }));
};

export const requestLoan = (articleId, duration) =>
    apiRequest("POST", "/api/loans", {
        articleId,
        requestText: "",
        days: DAYS[duration],
    });

export const respondLoan = (loanId, accept) =>
    apiRequest("PATCH", `/api/loans/me/${loanId}/${accept ? "accept" : "reject"}`);

export const generateCode = async (loanId) => {
    const { status, data } = await apiRequest("POST", `/api/loans/me/${loanId}/verification-code`);
    if (status !== 200) showError(data.error ?? "No se pudo generar el código.");
    return status === 200 ? data.code : null;
};

export const confirmCode = (loanId, code) => apiRequest("PATCH", `/api/loans/me/${loanId}/confirm`, { code });

const getRatings = async (condominiumId) => {
    const { status, data } = await apiRequest("GET", `/api/condominiums/${condominiumId}/reviews`);
    return status === 200 ? data : [];
};

export const rateLoan = ({ loanId, stars, comment }) => apiRequest("POST", "/api/reviews", { loanId, stars, comment });

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
        const first = setTimeout(refresh, 0);
        const t = setInterval(refresh, 10_000);
        return () => {
            clearTimeout(first);
            clearInterval(t);
        };
    }, [refresh]);

    return { ...data, refresh };
}

export const getMyProfile = async () => {
    const [{ status, data }, me, mine] = await Promise.all([
        apiRequest("GET", "/api/users/me"),
        apiRequest("GET", "/api/auth/me"),
        getMyCondominiums(),
    ]);
    if (status !== 200) return null;
    const phone = parsePhoneNumberFromString(data.phoneNumber ?? "");
    const adminOf = new Set(mine.registered.map((condominium) => condominium.id));
    return {
        paternalSurname: data.paternalSurname ?? "",
        maternalSurname: data.maternalSurname ?? "",
        givenNames: data.name ?? "",
        dialCode: phone?.country ?? "MX",
        phone: phone?.nationalNumber ?? "",
        photo: data.profilePicture ? await fileUrl(`/api/uploads/pfp/${data.profilePicture.split("/").pop()}`) : null,
        roles: [
            ...(me.data.isGlobalAdmin ? ["Administrador de YipShare"] : []),
            ...mine.registered.map((condominium) => `Administrador · ${condominium.name}`),
            ...mine.joined.filter((condominium) => !adminOf.has(condominium.id)).map((condominium) => `Vecino · ${condominium.name}`),
        ],
    };
};

export const uploadProfilePicture = (file) => {
    const body = new FormData();
    body.append("image", file);
    return apiRequestFormData("POST", "/api/users/me/pfp", body);
};

export const updateMyProfile = (profile) =>
    apiRequest("PATCH", "/api/users/me", {
        name: profile.givenNames.trim(),
        paternalSurname: profile.paternalSurname.trim(),
        maternalSurname: profile.maternalSurname.trim(),
        phoneNumber: `+${getCountryCallingCode(profile.dialCode)}${profile.phone}`,
    });

export const deleteMyAccount = () => apiRequest("DELETE", "/api/users/me");