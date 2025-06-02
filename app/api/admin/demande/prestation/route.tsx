import { verifyAuthToken } from "@/app/lib/auth";
import { poolPromise, sql } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const authResult = verifyAuthToken(req);
    if (authResult instanceof NextResponse) return authResult;

    const name = req.nextUrl.searchParams.get("name");
    const typePrestation = req.nextUrl.searchParams.get("typePrestation");
    const produit = req.nextUrl.searchParams.get("produit");
    const dateDebut = req.nextUrl.searchParams.get("dateDebut");
    const dateFin = req.nextUrl.searchParams.get("dateFin");
    const page = req.nextUrl.searchParams.get("page") ?? 1;
    const limit = req.nextUrl.searchParams.get("limit") ?? 20;

    if (!name || !typePrestation || !produit || !dateDebut || !dateFin) {
      return NextResponse.json(
        { error: "Paramètres manquants" },
        { status: 400 }
      );
    }

    //converssion de la date
    const splitDateDebut = dateDebut?.split("/");
    const dateFormatDebut = `${splitDateDebut?.[0]}${splitDateDebut?.[1]}${splitDateDebut?.[2]}`;
    const splitDateFin = dateFin?.split("/");
    const dateFormatFin = `${splitDateFin?.[0]}${splitDateFin?.[1]}${splitDateFin?.[2]}`;

    const pool = await poolPromise;
    const request = pool.request();

    // Champs obligatoires

    request.input("@DemandePrestationType", sql.NVarChar, typePrestation);
    request.input("@Produit", sql.NVarChar, produit);
    request.input("@DateDemandeDebut", sql.Int, dateFormatDebut);
    request.input("@DateDemandeFin", sql.Int, dateFormatFin);
    request.input("@Skip", sql.Int, page);
    request.input("@Take", sql.Int, limit);
    await request.execute("ps_DemandePrestationEnCours");

    return NextResponse.json({ message: "Mise à jour effectuée avec succès." });
  } catch (error) {
    console.error("Erreur mise à jour utilisateur :", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}
