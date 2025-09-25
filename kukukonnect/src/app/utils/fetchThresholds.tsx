const baseUrl = 'api/thresholds';

export async function fetchThresholds() {
    try {
        const response = await fetch(baseUrl);
        if (!response.ok) {
            throw new Error("Something went wrong: " + response.statusText);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        throw new Error('Failed to fetch thresholds: ' + (error as Error).message);
    }
}

export async function updateThresholds(data: {
  device_id: string;
  temp_threshold_min: string;
  temp_threshold_max: string;
  humidity_threshold_min: string;
  humidity_threshold_max: string;
}) {
  const { device_id } = data;

  try {
    const response = await fetch(`${baseUrl}/${device_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Something went wrong: " + response.statusText);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error("Failed to update thresholds: " + (error as Error).message);
  }
}