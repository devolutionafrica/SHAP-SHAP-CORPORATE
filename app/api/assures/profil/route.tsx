import { NextRequest, NextResponse } from "next/server";
import { poolPromise, sql } from "@/app/api/lib/db";
import { verifyAuthToken } from "@/app/api/lib/auth";

export async function GET(request: NextRequest) {
  // Vérification JWT
  const authResult = verifyAuthToken(request);
  if (authResult instanceof NextResponse) return authResult;

  // Récupération des paramètres de requête
  const login = request.nextUrl.searchParams.get("login");
  let pourcentages = null;
  if (!login) {
    return NextResponse.json(
      { error: "Paramètres manquants" },
      { status: 400 }
    );
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request().input("LOGIN", sql.VarChar, login)
      .query(`SELECT C.*, U.LOGIN
        FROM CLIENT_UNIQUE C inner join UTILISATEUR U on U.IDE_CLIENT_UNIQUE=C.IDE_CLIENT_UNIQUE 
        where LOGIN = @LOGIN`);

    if (result.recordset.length > 0) {
      pourcentages = await pool
        .request()
        .input("USERNAME", sql.VarChar, login)
        .query(`SELECT * FROM FnPourcentageProfil(@USERNAME)`);
    }

    return NextResponse.json(
      {
        data: result.recordset[0],
        pourcentage: pourcentages?.recordset[0].POURCENTAGE_PROFIL,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Erreur procédure stockée :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

const bindOptionalInput = (
  request: any,
  key: string,
  type: any,
  value: any
) => {
  if (value !== undefined && value !== null) {
    request.input(key, type, value);
  } else {
    request.input(key, type, null);
  }
};
