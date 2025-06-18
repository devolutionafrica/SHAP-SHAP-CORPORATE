import { poolPromise } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .query("SELECT * FROM INTEGRATEUR_PAIEMENT");
    return NextResponse.json(
      {
        data: result.recordset,
      },
      {
        status: 200,
      }
    );
  } catch (e) {
    return NextResponse.json(
      {},
      {
        status: 500,
        statusText: "Un problème est survenue",
      }
    );
  }
}
