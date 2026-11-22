import { apiRequest } from "./session";

export const toReport = (r) => ({
    id: r.id,
    involved: r.reported,
    reportedBy: r.reportedBy,
    details: r.text,
    status: r.state,
});

export const getCondominiumReports = async (condominiumId) => {
    const { status, data } = await apiRequest("GET", `/api/condominiums/${condominiumId}/reports`);
    return { status, reports: status === 200 ? data.map(toReport) : [] };
};

export const changeReportStatus = (condominiumId, reportId, status) =>
    apiRequest("PATCH", `/api/condominiums/${condominiumId}/reports/${reportId}`, { state: status });
