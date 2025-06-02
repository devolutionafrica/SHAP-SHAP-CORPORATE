import { verifyAuthToken } from "@/app/lib/auth";
import { poolPromise, sql } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const authResult = verifyAuthToken(req);
    if (authResult instanceof NextResponse) return authResult;

    const name = req.nextUrl.searchParams.get("name");

    const pool = await poolPromise;
    const request = pool.request();

    // Champs obligatoires
    request.input("aNom", sql.NVarChar, name);

    await request.execute("ps_ClientUniqueRejtsCount");

    return NextResponse.json({ message: "Mise à jour effectuée avec succès." });
  } catch (error) {
    console.error("Erreur mise à jour utilisateur :", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}
