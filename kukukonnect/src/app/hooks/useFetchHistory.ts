import { useEffect, useState } from "react";
import {fetchHistory} from '../utils/fetchHistory'


export interface HistoryType {
 temperature: string;
 humidity: string;
 timestamp: string;
}


const useFetchHistory = () => {
 const [history, setHistory] = useState<HistoryType[]>([]);
 const [loading, setLoading] = useState<boolean>(true);
 const [error, setError] = useState<string | null>(null);
 useEffect(() => {
   (async () => {
     try {
       const data = await fetchHistory();
       setHistory(data);
     } catch (error) {
       setError((error as Error).message);
     } finally {
       setLoading(false);
     }
   })();
 }, []);
 return { history, loading, error };
};
export default useFetchHistory;