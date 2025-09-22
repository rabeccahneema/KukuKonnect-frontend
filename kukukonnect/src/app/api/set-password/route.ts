const baseurl = process.env.BASE_URL;

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    const body = await request.text();

    const response = await fetch(`${baseurl}/set-password/`, {
      method: 'POST',
      headers: { 'content-type': contentType },
      body,
    });

    if (!response.ok) {
      throw new Error('Something went wrong: ' + response.statusText);
    }

    const result = await response.text();
    return new Response(result, {
      status: 200,
    });
  } catch (error) {
    return new Response((error as Error).message, {
      status: 500,
    });
  }
}