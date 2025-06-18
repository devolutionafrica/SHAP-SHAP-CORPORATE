import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export function verifyAuthToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Token manquant" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded;
  } catch (e) {
    console.error("Erreur de vérification du token JWT :", e);
    return NextResponse.json({ error: "Token invalide" }, { status: 401 });
  }
}

export default function checkTokenValidity(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded;
  } catch (e) {
    return null;
  }
}
