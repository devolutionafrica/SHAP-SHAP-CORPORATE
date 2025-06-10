import { NextRequest, NextResponse } from "next/server";
import { poolPromise, sql } from "@/app/api/lib/db";
import { verifyAuthToken } from "@/app/api/lib/auth";

export async function GET(request: NextRequest) {
  // Vérification JWT
  const authResult = verifyAuthToken(request);
  if (authResult instanceof NextResponse) return authResult;

  // Récupération des paramètres de requête
  const login = request.nextUrl.searchParams.get("userId");

  if (!login) {
    return NextResponse.json(
      { error: "Paramètres manquants" },
      { status: 400 }
    );
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request().input("IDCLIENT", sql.VarChar, login)
      .query(`SELECT * FROM CLIENT_UNIQUE
            WHERE IDE_CLIENT_UNIQUE=@IDCLIENT`);

    return NextResponse.json(
      {
        data: result.recordset[0],
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Erreur procédure stockée :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
