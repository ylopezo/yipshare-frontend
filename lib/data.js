import { getCountries, getCountryCallingCode } from "libphonenumber-js";

export const HIDDEN_PASSWORD = "••••••••";

const countryName = new Intl.DisplayNames(["es"], { type: "region" });

export const DIAL_CODES = getCountries()
    .map((country) => ({
        value: country,
        text: `${countryName.of(country)} (+${getCountryCallingCode(country)})`,
    }))
    .sort((a, b) => a.text.localeCompare(b.text, "es"));

export const digitsOnly = (text) => text.replace(/\D/g, "").slice(0, 10);
export const isPhoneValid = (tel) => /^\d{10}$/.test(tel);

export const matchesSearch = (search, ...fields) => {
    const query = search.trim().toLowerCase();
    return !query || fields.some((field) => field?.toLowerCase().includes(query));
};
