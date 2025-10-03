'use client';
import { useState, useEffect} from "react";
import useMqttSensors from "../hooks/useMqttSensors"; 
import useFetchThresholds from "../hooks/usefetchThreshholds";
import InfoCard from "./component/Infocard";
import TemperatureModal from "./component/Temperature-modal";
import ChartsSection from "./component/Graphs";
import { updateThresholds as updateThresholdsApi } from "../utils/fetchThresholds";
import FarmerLayout from "../shared-components/FarmerLayout";

type TempData = { time: string; temp: number };
type HumidityData = { time: string; hum: number };

export default function Dashboard() {
  const { sensors, loading, error } = useMqttSensors(); 
  const { thresholds = [], loading: thresholdsLoading, error: thresholdsError } = useFetchThresholds();
  
  const [currentTemp, setCurrentTemp] = useState<number | null>(null);
  const [currentHumidity, setCurrentHumidity] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [optimumRange, setOptimumRange] = useState<[number, number] | null>(null);
  const [minTemp, setMinTemp] = useState<number | null>(null);
  const [maxTemp, setMaxTemp] = useState<number | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [tempData, setTempData] = useState<TempData[]>([]);
  const [humidityData, setHumidityData] = useState<HumidityData[]>([]);

  useEffect(() => {
    if (sensors.length > 0) {
      const latestSensor = sensors[sensors.length - 1];
      setCurrentTemp(Number(latestSensor.temperature));
      setCurrentHumidity(Number(latestSensor.humidity));
      const currentTime = new Date();
      const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newTempData: TempData = {
        time: formattedTime,
        temp: Number(latestSensor.temperature),
      };
      setTempData(prevData => {
        if (prevData.length >= 20) {
          return [...prevData.slice(1), newTempData];
        }
        return [...prevData, newTempData];
      });

      const newHumidityData: HumidityData = {
        time: formattedTime,
        hum: Number(latestSensor.humidity),
      };
      setHumidityData(prevData => {
        if (prevData.length >= 20) {
          return [...prevData.slice(1), newHumidityData];
        }
        return [...prevData, newHumidityData];
      });
    }
  }, [sensors]);

  useEffect(() => {
    if (thresholds.length > 0) {
      const thresh = thresholds[0];
      const min = Number(thresh.temp_threshold_min);
      const max = Number(thresh.temp_threshold_max);
      setOptimumRange([min, max]);
      setMinTemp(min);
      setMaxTemp(max);
      setDeviceId(thresh.device_id ?? null);
    }
  }, [thresholds]);

  useEffect(() => {
    if (optimumRange) {
      setMinTemp(optimumRange[0]);
      setMaxTemp(optimumRange[1]);
    }
  }, [optimumRange]);

  const chartHeight = 350;
  const chartBoxMinHeight = "min-h-[340px] xl:min-h-[540px]";

  async function updateThresholds(deviceId: string, minTemp: number, maxTemp: number) {
    const humidityMin = thresholds[0]?.humidity_threshold_min ?? "40.00";
    const humidityMax = thresholds[0]?.humidity_threshold_max ?? "70.00";
    await updateThresholdsApi({
      device_id: deviceId,
      temp_threshold_min: minTemp.toFixed(2),
      temp_threshold_max: maxTemp.toFixed(2),
      humidity_threshold_min: humidityMin,
      humidity_threshold_max: humidityMax,
    });
  }

  const handleConfirm = async (enteredDeviceId: string, newMinTemp: number, newMaxTemp: number) => {
    try {
      await updateThresholds(enteredDeviceId, newMinTemp, newMaxTemp);
      setOptimumRange([newMinTemp, newMaxTemp]);
    } catch (error: any) {
      ;
    }
  };

  return (
    <FarmerLayout>
      <div className="max-w-full xl:max-w-7xl mx-auto relative">
        <h1 className="font-semibold mb-10 mt-12 text-xl lg:text-5xl text-[#084236]  leading-7 xl:leading-9 px-2 xl:px-0 text-center">
          Current Temperature and Humidity
        </h1>
        {loading && <p className="text-center text-gray-500">Connecting to real-time data stream...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}
        <div className="flex flex-col xl:flex-row gap-4 mb-8">
          <InfoCard label="Temperature" value={currentTemp} unit="°C" />
          <InfoCard label="Humidity" value={currentHumidity} unit="%" />
          <div className="bg-white shadow-xl rounded-xl flex-1 flex flex-col justify-center items-center text-emerald-900 gap-4 p-4 xl:p-8">
            <div className="text-lg">
              Optimum temp: {optimumRange
                ? <span className="font-bold">{optimumRange[0]}°C - {optimumRange[1]}°C</span>
                : <span className="italic text-gray-400">Loading...</span>}
            </div>
            <button
              className="bg-[#D2914A] text-white rounded-lg px-4 py-2 transition font-semibold text-lg w-full cursor-pointer"
              onClick={() => setModalOpen(true)}
              disabled={!optimumRange}
            >
              Change Temperature
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ChartsSection
            title="Recent Temperature"
            data={tempData}
            dataKey="temp"
            yLabel="Temperature (°C)"
            yDomain={[5, 40]}
            yTicks={[5, 10, 15, 20, 25, 30, 35, 40]}
            gradientId="tempGradient"
            gradientColor="#D2914A"
            chartHeight={chartHeight}
            chartBoxMinHeight={chartBoxMinHeight}
            valueFormatter={v => `${v}°C`}
          />
          <ChartsSection
            title="Recent Humidity"
            data={humidityData}
            dataKey="hum"
            yLabel="Humidity (%)"
            yDomain={[0, 70]}
            yTicks={[0, 10, 20, 30, 40, 50, 60, 70]}
            gradientId="humidityGradient"
            gradientColor="#365E59"
            chartHeight={chartHeight}
            chartBoxMinHeight={chartBoxMinHeight}
            valueFormatter={v => `${v}%`}
          />
        </div>
        {modalOpen && optimumRange && (
          <TemperatureModal
            minTemp={minTemp ?? optimumRange[0]}
            maxTemp={maxTemp ?? optimumRange[1]}
            setMinTemp={setMinTemp}
            setMaxTemp={setMaxTemp}
            optimumRange={optimumRange}
            setOptimumRange={setOptimumRange}
            closeModal={() => setModalOpen(false)}
            deviceId={deviceId}
            onConfirm={handleConfirm}
          />
        )}
        <div className="h-16 xl:h-0" />
      </div>
    </FarmerLayout>
  );
}