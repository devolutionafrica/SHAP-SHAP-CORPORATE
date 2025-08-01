import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/app/api/lib/auth";
import { poolPromise, sql } from "@/app/api/lib/db";
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  // Vérification du token JWT
  const params = await context.params;

  const username = request.nextUrl.searchParams.get("username");
  const idContrat = params.id;

  const authResult = verifyAuthToken(request);
  if (!authResult) {
    return new Response("Unauthorized", {
      status: 401,
      
    });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request().input("Contrat", sql.Int, idContrat)
      .query(`SELECT *
    FROM dbo.FnConsultationPoliceDetailInd(@Contrat)`);
    let souscripteur = null;
    if (result.recordset) {
      const ideClient = result.recordset[0].IDE_CLIENT_UNIQUE;

      console.log("resultat", result.recordset);

      souscripteur = await pool
        .request()
        .input("idclient", sql.VarChar, ideClient).query(`
          SELECT C.* FROM CLIENT_UNIQUE C
          where ide_client_unique=@idclient
            ;
      `);
    }

    const resultSituation = await pool
      .request()
      .input("NumeroPolice", sql.BigInt, idContrat)
      .query(
        " SELECT * FROM FnConsultationSituationFinanciere(@NumeroPolice,'') "
      );

    return NextResponse.json({
      data: result.recordset,
      suscripber: souscripteur.recordset[0],
      situationFinanciere: resultSituation.recordset[0],

      sizes: result.recordset.length,
    });
  } catch (err) {
    console.error("Erreur procédure stockée :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
