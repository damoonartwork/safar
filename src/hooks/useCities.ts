import { useState, useEffect } from 'react';
import { City } from '../types';

export function useCities() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadCities() {
      try {
        const response = await fetch('/cities.json');
        if (!response.ok) {
          throw new Error('عدم موفقیت در دریافت فهرست شهرها');
        }
        const data: City[] = await response.json();
        if (isMounted) {
          setCities(data);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'خطای نامشخص');
          setLoading(false);
        }
      }
    }
    loadCities();
    return () => {
      isMounted = false;
    };
  }, []);

  const getCityById = (id: string): City | undefined => {
    return cities.find((c) => c.id.toLowerCase() === id.toLowerCase());
  };

  const searchCities = (query: string): City[] => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return cities.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.province.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
    );
  };

  return { cities, loading, error, getCityById, searchCities };
}
