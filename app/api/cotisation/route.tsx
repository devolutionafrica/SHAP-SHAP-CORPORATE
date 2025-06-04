import { NextRequest, NextResponse } from "next/server";
import { poolPromise, sql } from "@/app/api/lib/db";
import { verifyAuthToken } from "@/app/api/lib/auth";

export async function GET(request: NextRequest) {
  const authResult = verifyAuthToken(request);
  if (authResult instanceof NextResponse) return authResult;

  // Récupération des paramètres de requête
  const numeroPolice = request.nextUrl.searchParams.get("numeroPolice");
  // Renommés pour éviter la confusion avec les objets Date
  const dateDebParam = request.nextUrl.searchParams.get("dateDeb");
  const dateFinParam = request.nextUrl.searchParams.get("dateFin");

  if (!numeroPolice || !dateDebParam || !dateFinParam) {
    return NextResponse.json(
      { error: "Paramètres manquants" },
      { status: 400 }
    );
  }

  let dateDeb: Date;
  let dateFin: Date;

  try {
    // Crée des objets Date JavaScript à partir des chaînes
    dateDeb = new Date(dateDebParam);
    dateFin = new Date(dateFinParam);

    if (isNaN(dateDeb.getTime()) || isNaN(dateFin.getTime())) {
      return NextResponse.json(
        { error: "Format de date invalide. Utilisez AAAA-MM-JJ." },
        { status: 400 }
      );
    }
  } catch (e) {
    return NextResponse.json(
      { error: "Erreur lors de la conversion des dates." },
      { status: 400 }
    );
  }

  try {
    console.log("La date Debut est :", dateDeb);
    console.log("La date Fin est :", dateFin);
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("NUMERO_POLICE", sql.VarChar, numeroPolice)
      .input("DATE_DEBUT", sql.Date, dateDeb) // Passer l'objet Date
      .input("DATE_FIN", sql.Date, dateFin) // Passer l'objet Date
      .query(
        `SELECT * FROM FnConsultationCotisationClientIndiv(@NUMERO_POLICE, @DATE_DEBUT, @DATE_FIN)`
      );

    const sizes = result.recordset.length;
    return NextResponse.json(
      { data: result.recordset, sizes },
      { status: 200 }
    );
  } catch (err) {
    console.error("Erreur procédure stockée :", err);
    // Vous pouvez inspecter err.originalError.info.message pour plus de détails si nécessaire
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
