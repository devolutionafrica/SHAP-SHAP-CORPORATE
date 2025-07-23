import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/app/api/lib/auth";
import { poolPromise } from "@/lib/db";

export async function GET({ request }: { request: NextRequest }) {
  //   const header = request.headers;
  const verifyToken = verifyAuthToken(request);

  if (verifyAuthToken == null) {
    return NextResponse.json({
      status: 401,
    });
  }

  const pool = await poolPromise;
  const result = await pool
    .request()
    .query(
      " SELECT Identifiant, Libelle, Id FROM [Extranet].[DemandePrestationTypes]"
    );

  return;
}
