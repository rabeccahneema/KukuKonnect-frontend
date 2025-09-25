 const baseUrl = process.env.BASE_URL;
export async function PUT(request: Request, { params }: { params: Promise<{ device_id: string }> }) {
  try {
    const { device_id } = await params;
    const body = await request.json();
    const response = await fetch(`${baseUrl}/thresholds/${device_id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`Failed to update threshold: ${response.status} ${response.statusText}`);
    }
    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}