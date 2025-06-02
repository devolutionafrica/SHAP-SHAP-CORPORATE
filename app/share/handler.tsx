import { cookies } from "next/headers";

export async function getAuthToken() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token");
  if (authToken) {
    return authToken;
  }
  return null;
}
