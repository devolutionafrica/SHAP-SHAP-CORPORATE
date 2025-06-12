import { verifyAuthToken } from "@/app/api/lib/auth";
import { poolPromise } from "@/app/api/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  const authResult = await verifyAuthToken(req);
  if (!authResult)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("username", id);
    const result = await request.query(
      `SELECT C.* FROM CONVENTION C inner join UTILISATEUR U on (C.IDE_CLIENT_UNIQUE=U.IDE_CLIENT_UNIQUE)
        where LOGIN= @username`
    );

    const nombreContrat = await request.input("Login", id).query(
      `
      SELECT COUNT(NUMERO_CONVENTION) totalContrat
      FROM CONTRATS
      WHERE NUMERO_CONVENTION IN 
      (
        SELECT NUMERO_DE_CONVENTION
        FROM CONVENTION C INNER JOIN UTILISATEUR U ON U.IDE_CLIENT_UNIQUE=C.IDE_CLIENT_UNIQUE
        WHERE U.LOGIN=@Login

      )`
    );
    return NextResponse.json({
      data: result.recordset,
      totalConvention: nombreContrat.recordset[0].totalContrat,
      sizes: result.recordset.length,
    });
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }

  return NextResponse.json({ userId: id });
}
