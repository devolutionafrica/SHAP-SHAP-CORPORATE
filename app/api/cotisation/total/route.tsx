import { NextRequest, NextResponse } from "next/server";
import { poolPromise, sql } from "@/app/api/lib/db";
import { verifyAuthToken } from "@/app/api/lib/auth";

export async function GET(request: NextRequest) {
  const authResult = verifyAuthToken(request);
  if (authResult instanceof NextResponse) return authResult;

  // Récupération des paramètres de requête
  const numeroPolice = request.nextUrl.searchParams.get("numeroPolice");
  const dateDeb = request.nextUrl.searchParams.get("dateDeb");
  const dateFin = request.nextUrl.searchParams.get("dateFin");

  if (!numeroPolice || !dateDeb || !dateFin) {
    return NextResponse.json(
      { error: "Paramètres manquants" },
      { status: 400 }
    );
  }

  //conversion des dates au format souhaité
  const dateDebSplit = dateDeb.split("/");

  const dateFormatDeb = `${dateDebSplit[2]}${dateDebSplit[1]}${dateDebSplit[0]}`;

  const dateFinSplit = dateFin.split("/");

  const dateFormatFin = `${dateFinSplit[2]}${dateFinSplit[1]}${dateFinSplit[1]}`;

  console.log("dateFormatDeb", dateFormatDeb);
  console.log("dateFormatFin", dateFormatFin);

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("NUMERO_POLICE", sql.VarChar, numeroPolice)
      .input("DATE_DEBUT", sql.BigInt, dateFormatDeb)
      .input("DATE_FIN", sql.BigInt, dateFormatFin)
      .query(
        `SELECT * FROM FnConsultationCotisationSommeTotalClientIndiv(@NUMERO_POLICE, @DATE_DEBUT, @DATE_FIN)`
      );

    const sizes = result.recordset.length;
    return NextResponse.json(
      { data: result.recordset[0], sizes },
      { status: 200 }
    );
  } catch (err) {
    console.error("Erreur procédure stockée :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
