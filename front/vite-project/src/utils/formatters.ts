export const formatAddress = (addr: string | null): string =>
  addr ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : "N/A";

export const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return "N/A";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(
    num
  );
};
