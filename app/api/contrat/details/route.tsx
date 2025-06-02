import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/app/api/lib/auth";
import { poolPromise, sql } from "@/app/api/lib/db";
export async function GET(request: NextRequest) {
  // Vérification du token JWT

  const codeFiliale = request.nextUrl.searchParams.get("codeFiliale");
  const username = request.nextUrl.searchParams.get("username");
  const idContrat = request.nextUrl.searchParams.get("idContrat");

  const authResult = verifyAuthToken(request);
  if (!authResult) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("Login", sql.VarChar, username)
      .input("NUMERO_CONTRAT", sql.VarChar, idContrat)
      .input("CODE_FILIALE", sql.VarChar, codeFiliale).query(`SELECT * 
    FROM dbo.FnConsultationPoliceDetail(@Login) Where NumeroContrat = @NUMERO_CONTRAT`);

    return NextResponse.json({
      data: result.recordset,
      sizes: result.recordset.length,
    });
  } catch (err) {
    console.error("Erreur procédure stockée :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
