export const timestampToDate = (timestamp: number | null) => {
  if (!timestamp) return "N/A";
  const date = new Date(timestamp / 1000);
  return date.toLocaleString();
};
