import { NextRequest, NextResponse } from "next/server";

import { verifyAuthToken } from "@/app/api/lib/auth";
import { poolPromiseDHW } from "@/app/api/lib/dbdwh";
import { sql } from "@/app/api/lib/dbdwh";
import { poolPromise } from "@/lib/db";

export async function GET(
  request: NextRequest,

  context: { params: { id: string } }
) {
  const authResult = verifyAuthToken(request);
  if (authResult instanceof NextResponse) return authResult;

  const params = await context.params;
  console.log("params: \n\n", params.id);
  const police = params.id;
  const date = request.nextUrl.searchParams.get("ANNEE");
  const codeFiliale = "CM_VIE";

  if (!police) {
    return NextResponse.json(
      { error: "Paramètres manquants" },
      { status: 400 }
    );
  }

  try {
    const pool2 = await poolPromise;
    let typePolice = await pool2
      .request()
      .input("type_police", sql.BigInt, police)
      .query(
        `SELECT IDE_TYPE_POLICE FROM CONTRATS WHERE NUMERO_POLICE = @type_police`
      );

    console.log("Reponse type police :", typePolice);

    typePolice = typePolice.recordset[0].IDE_TYPE_POLICE;

    if (typePolice == null) {
      return NextResponse.json(
        { error: "Type de police non trouvé" },
        { status: 404 }
      );
    }

    const pool = await poolPromiseDHW;

    console.log("date: \n\n", date);
    const result = await pool
      .request()
      .input("ANNEE", sql.Int, date)
      .input("CODE_FILIALE", sql.VarChar, codeFiliale)
      .input("POLICE", sql.Int, police)
      .execute(`Reporting.Avis_Situation_Police_CU`);

    return NextResponse.json(
      {
        data: result.recordset,
        typePolice: typePolice == 1 ? "INDIVIDUEL" : "GROUPE",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Erreur procédure stockée :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
