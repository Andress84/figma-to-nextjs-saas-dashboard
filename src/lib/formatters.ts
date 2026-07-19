const LOCALE = "en-US";
const STABLE_TIME_ZONE = "UTC";

const currencyFormatter = new Intl.NumberFormat(LOCALE, {
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
  style: "currency",
});

const transactionCurrencyFormatter = new Intl.NumberFormat(LOCALE, {
  currency: "USD",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
  style: "currency",
});

const countFormatter = new Intl.NumberFormat(LOCALE, {
  maximumFractionDigits: 0,
});

const compactDateFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: "numeric",
  month: "short",
  timeZone: STABLE_TIME_ZONE,
});

const fullDateFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: "numeric",
  month: "short",
  timeZone: STABLE_TIME_ZONE,
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: "numeric",
  hour: "2-digit",
  hourCycle: "h23",
  minute: "2-digit",
  month: "short",
  timeZone: STABLE_TIME_ZONE,
});

function parseIsoDate(value: string) {
  return new Date(`${value}T00:00:00Z`);
}

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function formatTransactionAmount(value: number) {
  return transactionCurrencyFormatter.format(value);
}

export function formatCount(value: number) {
  return countFormatter.format(value);
}

export function formatPercent(value: number, fractionDigits = 1) {
  return new Intl.NumberFormat(LOCALE, {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
    style: "percent",
  }).format(value / 100);
}

export function formatSignedPercent(value: number, fractionDigits = 1) {
  return new Intl.NumberFormat(LOCALE, {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
    signDisplay: "always",
    style: "percent",
  }).format(value / 100);
}

export function formatChurnPercent(value: number) {
  return formatPercent(value, 2);
}

export function formatPercentagePoints(value: number) {
  const formattedValue = new Intl.NumberFormat(LOCALE, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    signDisplay: "always",
  }).format(value);

  return `${formattedValue} pp`;
}

export function formatDate(value: string) {
  return fullDateFormatter.format(parseIsoDate(value));
}

export function formatDateTime(value: string) {
  return dateTimeFormatter.format(new Date(value));
}

export function formatDateRange(startDate: string, endDate: string) {
  const start = parseIsoDate(startDate);
  const end = parseIsoDate(endDate);

  if (start.getUTCFullYear() !== end.getUTCFullYear()) {
    return `${fullDateFormatter.format(start)} – ${fullDateFormatter.format(end)}`;
  }

  return `${compactDateFormatter.format(start)} – ${fullDateFormatter.format(end)}`;
}
