import { NextRequest } from "next/server";
import { verifyAuthToken } from "@/app/api/lib/auth";
import { poolPromise } from "@/app/api/lib/db";
export async function GET(request: NextRequest) {
  const authResult = verifyAuthToken(request);

  if (authResult instanceof Response) {
    return authResult; 
  }
  const pool = await poolPromise;
  const agences = await pool.request().query("SELECT * FROM AGENCES");
  const sizes = agences.recordset.length;
  return new Response(JSON.stringify({ agences: agences.recordset, sizes }), {
    headers: { "Content-Type": "application/json" },
  });
}
