const baseUrl = "/api/signup";
export async function fetchRegister(
  username: string,
  first_name: string,
  last_name: string,
  email: string,
  phone_number: string,
  user_type: string,
  password: string,
  image: any = null
) {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        first_name,
        last_name,
        email,
        phone_number,
        image,
        user_type,
        password,
      }),
    });
    if (!response.ok) {
      throw new Error("Registration failed: " + response.statusText);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error("Failed to register: " + (error as Error).message);
  }
}
