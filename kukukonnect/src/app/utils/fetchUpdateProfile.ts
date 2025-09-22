const baseurl = '/api/users';

export async function updateUser(userId: number, userData: any) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const response = await fetch(`${baseurl}/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Something went wrong: ' + response.statusText);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error("Failed to update user: " + (error as Error).message);
  }
}