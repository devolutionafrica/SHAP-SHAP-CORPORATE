import { NextRequest, NextResponse } from "next/server";

import { verifyAuthToken } from "@/app/api/lib/auth";
import { poolPromiseDHW } from "@/app/api/lib/dbdwh";
import { sql } from "@/app/api/lib/dbdwh";
import { poolPromise } from "@/lib/db";

export async function GET(
  request: NextRequest,

  context: { params: { id: string } }
) {
  const authResult = verifyAuthToken(request);
  if (authResult instanceof NextResponse) return authResult;

  const params = await context.params;

  const convention = params.id;
  const date = request.nextUrl.searchParams.get("ANNEE");
  const codeFiliale = "CM_VIE";

  if (!convention) {
    return NextResponse.json(
      { error: "Paramètres manquants" },
      { status: 400 }
    );
  }

  try {
    const pool2 = await poolPromise;

    const pool = await poolPromiseDHW;

    console.log("date: \n\n", date);
    const result = await pool
      .request()
      .input("ANNEE", sql.Int, date)
      .input("CODE_FILIALE", sql.VarChar, codeFiliale)
      .input("CONVENTION", sql.BigInt, convention)
      .execute(`Reporting.Avis_Situation_Police_CU_GROUP`);

    return NextResponse.json(
      {
        data: result.recordset,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Erreur procédure stockée :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
