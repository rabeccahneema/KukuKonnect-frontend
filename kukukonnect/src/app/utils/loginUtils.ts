const baseUrl = "/api/login";

export async function Login(email: string, password: string) {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error("Login failed: " + response.statusText);
    }
    const result = await response.json();
    if (result && result.user) {
      localStorage.setItem("user", JSON.stringify(result.user));
    }
    if (result && result.token) {
      localStorage.setItem("token", result.token);
    }
    return result;
  } catch (error) {
    throw new Error("Failed to  login: " + (error as Error).message);
  }
}
