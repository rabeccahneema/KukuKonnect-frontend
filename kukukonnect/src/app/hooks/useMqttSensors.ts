'use client';
import { useEffect, useState } from "react";
import mqtt from "mqtt";
import { SensorType } from "../utils/types/sensor";
import { MqttSensorPayload } from "../utils/types/sensor";

const broker = process.env.NEXT_PUBLIC_MQTT_BROKER_URL || '' ;
const options = {
    username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
    password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
}; 

const useMqttSensors = () => {
    const [sensors, setSensors] = useState<Array<SensorType>>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        const client = mqtt.connect(broker, options);

        client.on('connect', () => {

            client.subscribe('esp32/sensor_data', (error) => {
                if (error) {
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            });
        });

        client.on('message', (topic, message) => {
            try {
                const mqttData: MqttSensorPayload = JSON.parse(message.toString());
                const newSensorData: SensorType = {
                    sensor_data_id: `sensor-${Date.now()}`, 
                    timestamp: mqttData.timestamp,
                    temperature: mqttData.avg_temp,
                    humidity: mqttData.avg_humidity,
                    device_id: mqttData.device_id,
                };

                setSensors(prevSensors => [...prevSensors, newSensorData]);

            } catch (error) {
                setError(`Failed to parse MQTT message JSON: ${(error as Error).message}`);
            }
        });

        client.on('error', (err) => {
            setError(`MQTT Client Error: ${err.message}`);
            client.end();
        });

        client.on('reconnect', () => {
            setLoading(true);
        });

        return () => {
            client.end();
        };
    }, []); 

    return { sensors, loading, error };
};

export default useMqttSensors;


