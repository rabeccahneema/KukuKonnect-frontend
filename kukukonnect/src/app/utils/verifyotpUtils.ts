const baseUrl = "/api/verify_otp";
export async function verifyOtp(email: string, otp: string) {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        otp,
      }),
    });
    if (!response.ok) {
      throw new Error("OTP verification failed: " + response.statusText);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      message: "Failed to verify Otp: " + (error as Error).message,
    };
  }
}
