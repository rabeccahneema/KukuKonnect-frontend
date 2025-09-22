const baseUrl = "/api/forgot_password";

export async function ForgotPassword(email: string) {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error("Failed to send otp: " + (error as Error).message);
  }
}
