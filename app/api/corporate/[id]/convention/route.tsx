import { verifyAuthToken } from "@/app/lib/auth";
import { poolPromise } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

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
    return NextResponse.json({
      data: result.recordset,
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
