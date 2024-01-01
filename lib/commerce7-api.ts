export async function Commerce7API(tenantId: string) {
  const headers = new Headers();
  const base64Credentials = Buffer.from(
    `${process.env.APP_USERNAME}:${process.env.APP_PASSWORD}`
  ).toString("base64");
  headers.set("tenant", `${tenantId}` || "spectrawinery");
  headers.set("Authorization", `Basic ${base64Credentials}`);
  const response = await fetch("https://api.commerce7.com/v1/product", {
    method: "GET",
    headers: headers,
  });

  return response;
}
