import { useState, useEffect, useCallback } from "react";

export const useDataFetching = <T>(
  apiFunction: () => Promise<T>,
  refreshInterval = 0
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      if (!data) setLoading(true);
      const result = await apiFunction();
      setData(result);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch data. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  }, [apiFunction, data]);

  useEffect(() => {
    fetchData();
    if (refreshInterval > 0) {
      const intervalId = setInterval(fetchData, refreshInterval);
      return () => clearInterval(intervalId);
    }
  }, [fetchData, refreshInterval]);

  return { data, loading, error };
};
