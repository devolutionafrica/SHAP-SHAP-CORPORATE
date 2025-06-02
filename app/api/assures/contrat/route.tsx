import { NextRequest, NextResponse } from "next/server";
import { poolPromise, sql } from "@/app/lib/db";
import { verifyAuthToken } from "@/app/lib/auth";

export async function GET(request: NextRequest) {
  // Vérification JWT
  const authResult = verifyAuthToken(request);
  if (authResult instanceof NextResponse) return authResult;

  // Récupération des paramètres de requête
  const username = request.nextUrl.searchParams.get("login");

  if (!username) {
    return NextResponse.json(
      { error: "Paramètres manquants" },
      { status: 400 }
    );
  }

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("LOGIN_CLIENT", sql.VarChar, username).query(`
      SELECT C.*, U.LOGIN,P.DESC_PRODUIT FROM CONTRATS C inner join UTILISATEUR U on C.IDE_CLIENT_UNIQUE=U.IDE_CLIENT_UNIQUE 
      INNER JOIN produits P ON C.IDE_PRODUIT=P.IDE_PRODUIT
      WHERE LOGIN= @LOGIN_CLIENT
    `);

    const sizes = result.recordset.length;
    return NextResponse.json(
      { data: result.recordset, sizes },
      { status: 200 }
    );
  } catch (err) {
    console.error("Erreur procédure stockée :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
