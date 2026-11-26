import { useCallback, useEffect, useRef, useState } from 'react';
import { useAxiosInstance } from './useAxiosInstance';

export const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axios = useAxiosInstance();
  const active = useRef(null);

  const reFetch = useCallback(async () => {
    active.current?.abort();
    const request = new AbortController();
    active.current = request;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(url, { signal: request.signal });
      if (!request.signal.aborted) setData(response.data);
    } catch (failure) {
      if (!request.signal.aborted) setError(failure);
    } finally {
      if (!request.signal.aborted) setLoading(false);
    }
  }, [axios, url]);

  useEffect(() => {
    setData([]);
    reFetch();
    return () => active.current?.abort();
  }, [reFetch]);

  return { data, loading, error, reFetch };
};
