import { NextRequest, NextResponse } from "next/server";
import { poolPromise, sql } from "@/app/api/lib/db";
import { verifyAuthToken } from "@/app/api/lib/auth";
import extractUsernameIntoken from "../auth/login/route";

export async function GET(request: NextRequest) {
  // Vérification JWT
  const authResult = verifyAuthToken(request);
  if (authResult instanceof NextResponse) return authResult;

  

  const username = extractUsernameIntoken(request);

  if (username == null) {
    return new NextResponse(null, {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  console.log("username:\n\n", username);

  try {
    const pool = await poolPromise;
    const result = await pool.request().input("Login", sql.VarChar, username)
      .query(`SELECT * FROM
          FnConsultationPoliceDetail(@Login)`);

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
