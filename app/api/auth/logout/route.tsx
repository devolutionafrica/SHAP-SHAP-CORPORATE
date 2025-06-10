import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/app/api/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  // Vérification du token JWT
  const authResult = verifyAuthToken(request);
  if (authResult instanceof NextResponse) return authResult;

  // Suppression du cookie d'authentification
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");

  // Réponse de succès
  return NextResponse.json({ message: "Déconnexion réussie" }, { status: 200 });
}
