import { NextRequest, NextResponse } from "next/server";
import { poolPromise, sql } from "@/app/api/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const aTelephone = searchParams.get("telephone");
    const aNumeroPolice = searchParams.get("numeroPolice");

    // Vérification des paramètres requis
    if (!aTelephone || !aNumeroPolice) {
      return NextResponse.json(
        { error: "Paramètres manquants" },
        { status: 400 }
      );
    }

    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("aTelephone", sql.VarChar, aTelephone ?? "")
      .input(
        "aNumeroPolice",
        sql.Int,
        aNumeroPolice ? parseInt(aNumeroPolice) : 0
      )
      .execute("ps_RechercheUtilisateur_Count");

    const count = result.recordset[0]?.CountUtilisateurs ?? 0;

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Erreur appel procédure :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
