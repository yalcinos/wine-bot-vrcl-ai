import { Buffer } from "buffer";

export async function Commerce7API(tenantId: string, endpoint: string) {
  const headers = createHeaders(tenantId);
  const response = await fetchData(
    `https://api.commerce7.com/${endpoint}`,
    headers
  );

  return response.json();
}

function createHeaders(tenantId: string) {
  const headers = new Headers();
  const base64Credentials = encodeCredentials(
    process.env.APP_USERNAME as any,
    process.env.APP_PASSWORD as any
  );
  headers.set("tenant", `${tenantId}` || "spectrawinery");
  headers.set("Authorization", `Basic ${base64Credentials}`);
  headers.set("Content-Type", "application/json");

  return headers;
}

function encodeCredentials(username: string, password: string): string {
  return Buffer.from(`${username}:${password}`).toString("base64");
}

async function fetchData(url: string, headers: Headers): Promise<Response> {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    // if (!response.ok) {
    //   throw new Error(`HTTP error! Status: ${response.status}`);
    // }

    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
