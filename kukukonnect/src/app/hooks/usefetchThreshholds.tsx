'use client'
import { useEffect, useState } from "react";
import { fetchThresholds } from "../utils/fetchThresholds";
import { ThresholdType } from "../utils/types/threshholds";

const useFetchThresholds = () => {
  const [thresholds, setThresholds] = useState<Array<ThresholdType>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const thresholds = await fetchThresholds();
        setThresholds(thresholds);  
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { thresholds, loading, error };
};
export default useFetchThresholds;
