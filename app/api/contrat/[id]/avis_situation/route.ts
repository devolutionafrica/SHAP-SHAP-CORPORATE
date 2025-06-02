import { NextRequest, NextResponse } from "next/server";

import { verifyAuthToken } from "@/app/api/lib/auth";
import { poolPromiseDHW } from "@/app/api/lib/dbdwh";
import { sql } from "@/app/api/lib/dbdwh";

export async function GET(
  request: NextRequest,

  context: { params: { id: string } }
) {
  const authResult = verifyAuthToken(request);
  if (authResult instanceof NextResponse) return authResult;

  // Récupération des paramètres de requête
  const params = await context.params;
  console.log("params: \n\n", params.id);
  const numeroPolice = params.id;
  const codeFiliale = "CM_VIE";

  if (!numeroPolice) {
    return NextResponse.json(
      { error: "Paramètres manquants" },
      { status: 400 }
    );
  }

  try {
    const pool = await poolPromiseDHW;
    const date = new Date().getFullYear() - 1;
    console.log("date: \n\n", date);
    const result = await pool
      .request()
      .input("ANNEE", sql.Int, date)
      .input("CODE_FILIALE", sql.VarChar, codeFiliale)
      .input("POLICE", sql.Int, numeroPolice)
      .execute(`Reporting.Avis_Situation_Police_CU`);

    return NextResponse.json({ data: result.recordset }, { status: 200 });
  } catch (err) {
    console.error("Erreur procédure stockée :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
