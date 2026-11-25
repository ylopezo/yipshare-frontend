import { apiRequest, apiRequestFormData, uploadUrl } from "./session";

export const toReport = async (report) => ({
    id: report.id,
    involved: report.reported,
    reportedBy: report.reportedBy,
    details: report.text,
    status: report.state,
    images: (await Promise.all((report.images ?? []).map(uploadUrl))).filter(Boolean),
});

export const getCondominiumReports = async (condominiumId) => {
    const { status, data } = await apiRequest("GET", `/api/condominiums/${condominiumId}/reports`);
    const list = Array.isArray(data) ? data : [];
    return { status, reports: status === 200 ? await Promise.all(list.map(toReport)) : [] };
};

export const changeReportStatus = (condominiumId, reportId, status) =>
    apiRequest("PATCH", `/api/condominiums/${condominiumId}/reports/${reportId}`, { state: status });

export const getUserReports = async (userId) => {
    const { status, data } = await apiRequest("GET", `/api/reports/users/${userId}`);
    if (status !== 200) return [];
    const list = Array.isArray(data) ? data : [];
    return list.map((report, i) => ({
        id: report.id ?? i,
        details: report.text,
        status: report.resolved ? "resolved" : "pending",
    }));
};

export const createReport = ({ loanId, text, images }) => {
    const body = new FormData();
    body.append("loanId", loanId);
    body.append("text", text);
    (Array.isArray(images) ? images : []).forEach((file) => body.append("images", file));
    return apiRequestFormData("POST", "/api/reports", body);
};
