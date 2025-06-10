import { NextRequest, NextResponse } from "next/server";
import { poolPromise, sql } from "@/app/api/lib/db";

import { findUserByUsername } from "@/app/models/user.model";

export async function UPDATE(request: NextRequest) {
  // Récupération des paramètres de requête
  const login = request.nextUrl.searchParams.get("username");
  const password = request.nextUrl.searchParams.get("password");
  const newPassword = request.nextUrl.searchParams.get("newPassword");
  const newLogin = request.nextUrl.searchParams.get("newLogin");
  const user = await findUserByUsername(login!);

  if (!login || !password || !newPassword || !newLogin) {
    return new Response("Vérifiez les paramètres", {
      status: 404,
    });
  }

  if (user == null) {
    return new Response("Utilisateur non trouvé", {
      status: 404,
    });
  }

  if (password != user.MOT_DE_PASSE) {
    return new Response("Mot de passe incorrect", {
      status: 401,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("Login", sql.VarChar, login)
      .input("newLogin", sql.VarChar, newLogin)
      .input("NewPassword", sql.VarChar, newPassword).query(`
         UPDATE Utilisateurs
         SET MOT_DE_PASSE = @newPassword
         SET LOGIN=@newLogin
         WHERE LOGIN = @Login
        `);

    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    console.error("Erreur procédure stockée :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
