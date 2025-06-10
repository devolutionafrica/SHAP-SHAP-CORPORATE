import { NextRequest, NextResponse } from "next/server";
import { poolPromise, sql } from "@/app/api/lib/db";
import { verifyAuthToken } from "@/app/api/lib/auth";

export async function GET(request: NextRequest) {
  // Vérification JWT
  const authResult = verifyAuthToken(request);
  if (authResult instanceof NextResponse) return authResult;

  // Récupération des paramètres de requête
  const codeFiliale = request.nextUrl.searchParams.get("codeFiliale");
  const idClient = request.nextUrl.searchParams.get("idClient");
  const dateDeb = request.nextUrl.searchParams.get("dateDeb");
  const dateFin = request.nextUrl.searchParams.get("dateFin");

  if (!idClient || !codeFiliale) {
    return NextResponse.json(
      { error: "Paramètres manquants" },
      { status: 400 }
    );
  }

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("NUMERO_CLIENT", sql.VarChar, idClient)
      .input("CODE_FILIALE", sql.VarChar, codeFiliale)
      .input("DATE_DEBUT", sql.DateTime, dateDeb ? new Date(dateDeb) : null)
      .input("DATE_FIN", sql.DateTime, dateFin ? new Date(dateFin) : null)
      .query(
        `SELECT C.* FROM CONTRATS FnConsultationCotisationClientIndividuel(@NUMERO_CLIENT, @CODE_FILIALE,@DATE_DEBUT,@DATE_FIN)`
      );

    return NextResponse.json(result);
  } catch (err) {
    console.error("Erreur procédure stockée :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
