// lib/api/auth.ts
import axios from "axios";

export async function login(payload: { email: string; password: string }) {
  const response = await axios.post(
    "http://localhost:3001/api/auth/login",
    payload
  );
  return response.data;
}
