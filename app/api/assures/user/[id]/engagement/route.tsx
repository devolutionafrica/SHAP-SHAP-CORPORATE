import { verifyAuthToken } from "@/app/api/lib/auth";
import { poolPromise, sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const params = await context.params;
    const authResult = verifyAuthToken(request);
    const token = request.headers.get("authorization")?.split(" ")[1];
    const username = params.id;
    let nb: number | null;
    let pourcentage: number | null;
    if (authResult == null) {
      return NextResponse.json(
        {},
        { status: 401, statusText: "Token expiré !!!" }
      );
    }
    //chargement de tous les contrats  pour un utilisateur

    const query = `
    SELECT COUNT(*) 'NOMBRE', S.ETAT_QUITTANCE FROM SummaryQuittanceSoldeesImpayees S INNER JOIN CONTRATS C ON (S.NUMERO_POLICE=C.NUMERO_POLICE) INNER JOIN UTILISATEUR U ON (U.IDE_CLIENT_UNIQUE=C.IDE_CLIENT_UNIQUE)
    WHERE U.LOGIN=@Login
    GROUP BY S.ETAT_QUITTANCE
  `;

    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("Login", sql.VarChar, username)
      .query(query);
    console.log("resultat:", result, "username", username, "\n\n\n");
    const res = result.recordset;

    if (res) {
      if (res.NOMBRE != null) {
        return NextResponse.json({ data: 0 });
      }
      let quittancePaye = 0;
      quittancePaye = getIndex("Soldée", "ETAT_QUITTANCE", res);
      let nbTotal = 0;
      nbTotal = calculTotal(res);
      console.log("Nombre total :", nbTotal, "Reponse :", res);
      const val = quittancePaye / nbTotal;
      return NextResponse.json({
        data: val,
      });
    }
    return NextResponse.json(
      {},
      { status: 400, statusText: "Aucune quittance" }
    );
  } catch (e) {
    console.log("Une erreur est survenue:", e);
    return NextResponse.json(
      {},
      { status: 500, statusText: "Erreur interne du sereveur." }
    );
  }
}

const getIndex = (val: any, ele: string, tab: []): number => {
  for (let i = 0; i < tab.length; i++) {
    if (tab[i][ele] == val) {
      return tab[i]["NOMBRE"] as number;
    }
  }

  return 0;
};

const calculTotal = (data: any): number => {
  let somme = 0;
  for (let i = 0; i < data.length; i++) {
    somme += data[i]["NOMBRE"];
  }
  return somme as number;
};
