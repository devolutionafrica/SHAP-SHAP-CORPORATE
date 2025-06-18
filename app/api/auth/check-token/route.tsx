import { NextRequest, NextResponse } from "next/server";
import checkTokenValidity from "../../lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (checkTokenValidity(token)) {
      return NextResponse.json(
        {
          body: "Token bien valide",
        },
        {
          status: 200,
        }
      );
    }
    return NextResponse.json(
      {
        message: "Le token est invalide",
      },
      {
        status: 403,
        statusText: "Le token est invalide",
      }
    );
  } catch (e) {
    return NextResponse.json(
      {
        message: "Le token est bien valide",
      },
      {
        status: 403,
        statusText: "Le token est invalide",
      }
    );
  }
}
