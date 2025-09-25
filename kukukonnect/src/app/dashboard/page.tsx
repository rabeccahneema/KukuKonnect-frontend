'use client';
import { useState, useEffect } from "react";
import useFetchSensors from "../hooks/usefetchSensors";
import useFetchThresholds from "../hooks/usefetchThreshholds";
import InfoCard from "./component/Infocard";
import TemperatureModal from "./component/Temperature-modal";
import ChartsSection from "./component/Graphs";
import { updateThresholds as updateThresholdsApi } from "../utils/fetchThresholds";

type TempData = { time: string; temp: number | null };
type HumidityData = { time: string; hum: number | null };

export default function Dashboard() {
  const { sensors = [], loading, error } = useFetchSensors();
  const { thresholds = [], loading: thresholdsLoading, error: thresholdsError } = useFetchThresholds();

  const [tempData, setTempData] = useState<TempData[]>([]);
  const [humidityData, setHumidityData] = useState<HumidityData[]>([]);
  const [currentTemp, setCurrentTemp] = useState<number | null>(null);
  const [currentHumidity, setCurrentHumidity] = useState<number | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [optimumRange, setOptimumRange] = useState<[number, number] | null>(null);
  const [minTemp, setMinTemp] = useState<number | null>(null);
  const [maxTemp, setMaxTemp] = useState<number | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const tempArr: TempData[] = hours.map(hr => {
      const item = sensors.find(s => {
        const date = new Date(s.timestamp);
        return `${date.getHours()}:00` === hr;
      });
      return {
        time: hr,
        temp: item ? Number(item.temperature) : null
      };
    });

    const humArr: HumidityData[] = hours.map(hr => {
      const item = sensors.find(s => {
        const date = new Date(s.timestamp);
        return `${date.getHours()}:00` === hr;
      });
      return {
        time: hr,
        hum: item ? Number(item.humidity) : null
      };
    });

    setTempData(tempArr);
    setHumidityData(humArr);

    if (sensors.length) {
      const latestSensor = sensors[sensors.length - 1];
      setCurrentTemp(Number(latestSensor.temperature));
      setCurrentHumidity(Number(latestSensor.humidity));
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
      alert(`Failed to update temperature thresholds: ${error.message}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-white relative">
      <main className="flex-1 px-2 xl:px-8 max-w-full xl:max-w-7xl mx-auto relative">
        <h1 className="font-semibold text-emerald-900 mb-10 mt-12 text-xl xl:text-3xl leading-7 xl:leading-9 px-2 xl:px-0 text-center">
          Current Temperature and Humidity
        </h1>
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
            title="Hourly Temperature"
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
            title="Hourly Humidity"
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
      </main>
    </div>
  );
}