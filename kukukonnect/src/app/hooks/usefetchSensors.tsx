'use client'
import { useEffect, useState } from "react";
import { fetchSensors } from "../utils/fetchSensors";
import { SensorType } from "../utils/types/sensor";

const useFetchSensors = () => {
  const [sensors, setSensors] = useState<Array<SensorType>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const sensors = await fetchSensors();
        setSensors(sensors);  
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { sensors, loading, error };
};

export default useFetchSensors;




