export function formatMoney(value: unknown, fallback = "0.00") {
  if (value === null || value === undefined || value === "") return fallback;
  const numberValue = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numberValue)) return fallback;
  return numberValue.toFixed(2);
}
