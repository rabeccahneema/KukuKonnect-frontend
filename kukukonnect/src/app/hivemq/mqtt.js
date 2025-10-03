'use client';
import { useEffect } from 'react';
import mqtt from 'mqtt';
const MqttSubscriber = () => {

  useEffect(() => {
    const broker = process.env.NEXT_PUBLIC_MQTT_BROKER_URL;
    const username = process.env.NEXT_PUBLIC_MQTT_USERNAME;
    const password = process.env.NEXT_PUBLIC_MQTT_PASSWORD;
    const topic = process.env.NEXT_PUBLIC_MQTT_TOPIC || 'esp32/sensor_data';
    const apiEndpoint = process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT;
    if (!broker || !username || !password || !apiEndpoint) {
      console.error('Missing required environment variables. Please check your configuration.');
      return;
    }

    const options = {
      username,
      password,
    };
    const client = mqtt.connect(broker, options);
    client.on('connect', () => {
      client.subscribe(topic, (err) => {
        if (err) {
        } else {
        }
      });
    });
    client.on('message', (topic, message) => {
      try {
        const mqttData = JSON.parse(message.toString());
        const postData = {
            timestamp: mqttData.timestamp,
            temperature: mqttData.avg_temp,
            humidity: mqttData.avg_humidity,
            device_id: mqttData.device_id,
        };
        fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        })
          .then(res => res.json())
          .then(response => {
          })
          .catch(error => {
          });
      } catch (err) {
      }
    });
    client.on('error', (err) => {
      client.end();
    });
    client.on('reconnect', () => {
    });
    return () => {
      client.end();
    };
  }, []);
  return null;
};
export default MqttSubscriber;