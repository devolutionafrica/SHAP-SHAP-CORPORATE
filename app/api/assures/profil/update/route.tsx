// app/api/assures/profil/update/route.tsx
import { verifyAuthToken } from "@/app/api/lib/auth";
import { poolPromise, sql } from "@/app/api/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(re: NextRequest) {
  try {
    const authResult = verifyAuthToken(re);
    if (authResult == null) {
      // Si verifyAuthToken renvoie une réponse (ex: non autorisé), on la retourne immédiatement.
      return NextResponse.json(
        {
          error: "Token d'authentification invalide ou expiré.",
        },
        { status: 401 }
      );
    }

    const body = await re.json();
    const {
      login,
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

    console.log("Mise à jour des infos utilisateur (body reçu) :", body);

    if (!login) {
      return NextResponse.json({ error: "Login requis" }, { status: 400 });
    }

    const pool = await poolPromise; // Assurez-vous que poolPromise se résout correctement

    // Première requête : Récupération de l'IDE_CLIENT_UNIQUE
    const request = pool.request();
    request.input("Login", sql.NVarChar, login);
    const result = await request.query(
      `SELECT IDE_CLIENT_UNIQUE FROM UTILISATEUR WHERE LOGIN = @Login`
    );
    const idClientUnique = result.recordset[0]?.IDE_CLIENT_UNIQUE;

    if (!idClientUnique) {
      return NextResponse.json(
        { error: "Aucun utilisateur trouvé avec ce login." },
        { status: 404 }
      );
    }

    // Deuxième requête : Mise à jour des informations
    const request2 = pool.request();

    const req = `
        UPDATE CLIENT_UNIQUE
        SET 
            DATE_NAISSANCE = ISNULL(CONVERT(INT, CONVERT(VARCHAR(8), @DateNaissance, 112)), DATE_NAISSANCE),
            LIEU_NAISSANCE = ISNULL(@LieuNaissance, LIEU_NAISSANCE),
            ADRESSE_POSTALE = ISNULL(@AdressePostale, ADRESSE_POSTALE),
            TELEPHONE = ISNULL(@Telephone, TELEPHONE),
            PROFESSION = ISNULL(@Profession, PROFESSION),
            CIVILITE = ISNULL(@Civilite, CIVILITE),
            NATIONALITE = ISNULL(@Nationalite, NATIONALITE),
            SITUATION_MATRIMONIALE = ISNULL(@SituationMatrimoniale, SITUATION_MATRIMONIALE)
        WHERE IDE_CLIENT_UNIQUE = @IdClientUnique;

        UPDATE UTILISATEUR
        SET 
            EMAIL = ISNULL(@Email, EMAIL),
            PHOTO_UTILISATEUR = ISNULL(@PhotoUtilisateur, PHOTO_UTILISATEUR)
        WHERE LOGIN = @Login;`;

    // --- Ajout et ajustement des inputs pour la deuxième requête ---
    request2.input("Login", sql.NVarChar, login);

    // Convertit dateNaissance en objet Date ou null
    request2.input(
      "DateNaissance",
      sql.Date,
      dateNaissance ? new Date(dateNaissance) : null
    );

    // S'assurer que tous les inputs de type chaîne sont des chaînes ou null (pas undefined)
    request2.input("LieuNaissance", sql.NVarChar, lieuNaissance || null);
    request2.input("AdressePostale", sql.NVarChar, adressePostale || null);
    request2.input("Telephone", sql.NVarChar, telephone || null);
    request2.input("Profession", sql.NVarChar, profession || null);
    request2.input("Civilite", sql.NVarChar, civilite || null);
    request2.input("Nationalite", sql.NVarChar, nationalite || null);
    request2.input(
      "SituationMatrimoniale",
      sql.NVarChar,
      situationMatrimoniale || null
    );
    request2.input("Email", sql.NVarChar, email || null);

    request2.input("IdClientUnique", sql.BigInt, idClientUnique);

    // Gérer photoUtilisateur:
    // Si PHOTO_UTILISATEUR dans la DB est NVarChar (pour URL/chemin/base64 string):
    request2.input("PhotoUtilisateur", sql.NVarChar, photoUtilisateur || null);
    // Si PHOTO_UTILISATEUR dans la DB est VarBinary(MAX) (pour données binaires de l'image):
    // request2.input("PhotoUtilisateur", sql.VarBinary(sql.MAX), photoUtilisateur ? Buffer.from(photoUtilisateur, "base64") : null);

    // Exécuter les requêtes de mise à jour
    await request2.query(req);

    // Retourne la réponse de succès
    return NextResponse.json({ message: "Mise à jour effectuée avec succès." });
  } catch (error) {
    // Si une erreur se produit n'importe où dans le bloc try, elle est capturée ici
    console.error("Erreur mise à jour utilisateur :", error);
    // Retourne une réponse d'erreur
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}
