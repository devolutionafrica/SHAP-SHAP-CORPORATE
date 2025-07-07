import { findUserByUsername } from "@/app/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const user = await findUserByUsername(username);
  if (!user) {
    return NextResponse.json(
      { error: "Utilisateur non trouvé" },
      { status: 401 }
    );
  }

  console.log("User trouvé :", user);

  if (password != user.MOT_DE_PASSE) {
    return NextResponse.json(
      { error: "Mot de passe incorrect" },
      { status: 401 }
    );
  }

  const token = jwt.sign(
    { id: user.NUMERO_CLIENT, username: user.LOGIN },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );

  return NextResponse.json(
    {
      codeFilliale: user.CODE_FILIALE,
      numeroClient: user.NUMERO_CLIENT,
      username: user.LOGIN,
      telephone: user.TELEPHONE,
      name: user.NOM_CLIENT,
      prenom: user.PRENOM_CLIENT,
      adressepostale: user.ADRESSE_POSTALE,
      adresseMail: user.ADRESSE_MAIL,
      isFirstConnection: user.ISFIRSTCONNEXION,
      token,
    },
    { status: 200 }
  );
}

export default function extractUsernameIntoken(request: NextRequest) {
  const header = request.headers.get("authorization");
  let token = null;
  if (header && header.startsWith("Bearer ")) {
    token = header.split(" ")[1];
  } else {
    return null;
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET!);

  if (decoded && typeof decoded == "object" && "username" in decoded) {
    return decoded.username;
  }
  return null;
}
