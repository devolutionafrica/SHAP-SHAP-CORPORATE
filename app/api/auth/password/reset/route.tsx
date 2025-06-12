import { NextRequest, NextResponse } from "next/server";
import { poolPromise, sql } from "@/app/api/lib/db";

import { findUserByUsername } from "@/app/models/user.model";
import { verifyAuthToken } from "@/app/api/lib/auth";

export async function PATCH(request: NextRequest) {
  const auth = verifyAuthToken(request);

  if (!auth)
    return new Response("Unauthorized", {
      status: 401,
    });

  const { login, password, newPassword } = await request.json();

  const user = await findUserByUsername(login!);

  if (!login || !password || !newPassword) {
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

      .input("NewPassword", sql.VarChar, newPassword).query(`
         UPDATE Utilisateur
         SET MOT_DE_PASSE = @NewPassword, ISFIRSTCONNEXION=1
         WHERE LOGIN = @Login
        `);

    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    console.error("Erreur SQL", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
