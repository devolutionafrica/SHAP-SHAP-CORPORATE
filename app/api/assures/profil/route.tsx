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

export async function PATCH(req: NextRequest) {
  try {
    const authResult = verifyAuthToken(req);
    if (authResult instanceof NextResponse) return authResult;

    const body = await req.json();
    const {
      login,
      nomClient,
      prenomsClient,
      dateNaissance,
      lieuNaissance,
      adressePostale,
      telephone,
      profession,
      civilite,
      nationalite,
      situationMatrimoniale,
      email,
      photoUtilisateur,
    } = body;

    if (!login) {
      return NextResponse.json({ error: "Login requis" }, { status: 400 });
    }

    const pool = await poolPromise;
    const request = pool.request();

    // Champs obligatoires
    request.input("Login", sql.NVarChar, login);

    // Champs optionnels
    bindOptionalInput(request, "NomClient", sql.NVarChar, nomClient);
    bindOptionalInput(request, "PrenomsClient", sql.NVarChar, prenomsClient);
    bindOptionalInput(
      request,
      "DateNaissance",
      sql.DateTime,
      dateNaissance ? new Date(dateNaissance) : null
    );
    bindOptionalInput(request, "LieuNaissance", sql.NVarChar, lieuNaissance);
    bindOptionalInput(request, "AdressePostale", sql.NVarChar, adressePostale);
    bindOptionalInput(request, "Telephone", sql.NVarChar, telephone);
    bindOptionalInput(request, "Profession", sql.NVarChar, profession);
    bindOptionalInput(request, "Civilite", sql.NVarChar, civilite);
    bindOptionalInput(request, "Nationalite", sql.NVarChar, nationalite);
    bindOptionalInput(
      request,
      "SituationMatrimoniale",
      sql.NVarChar,
      situationMatrimoniale
    );
    bindOptionalInput(request, "Email", sql.NVarChar, email);

    // Photo utilisateur optionnelle en base64
    bindOptionalInput(
      request,
      "PhotoUtilisateur",
      sql.VarBinary,
      photoUtilisateur ? Buffer.from(photoUtilisateur, "base64") : null
    );

    await request.execute("SpModifierInfoClientParLogin2");

    return NextResponse.json({ message: "Mise à jour effectuée avec succès." });
  } catch (error) {
    console.error("Erreur mise à jour utilisateur :", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}
