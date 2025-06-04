import { NextRequest, NextResponse } from "next/server";
import { poolPromise, sql } from "@/app/api/lib/db";
import { verifyAuthToken } from "@/app/api/lib/auth";

export async function GET(request: NextRequest) {
  const authResult = verifyAuthToken(request);
  if (authResult instanceof NextResponse) return authResult;

  // Récupération des paramètres de requête
  const numeroPolice = request.nextUrl.searchParams.get("numeroPolice");
  const typeDemande = request.nextUrl.searchParams.get("typeDemande");

  if (!numeroPolice) {
    return NextResponse.json(
      { error: "Paramètres manquants" },
      { status: 400 }
    );
  }

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("NumeroPolice", sql.Int, numeroPolice)
      .input("TypeDemande", sql.Int, typeDemande ?? "")
      .query(`SELECT * FROM DemandePrestationEligibilite
                (@NumeroPolice, @TypeDemande)`);

    return NextResponse.json({ data: result.recordset }, { status: 200 });
  } catch (err) {
    console.error("Erreur procédure stockée :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
