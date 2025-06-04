import { verifyAuthToken } from "@/app/api/lib/auth";
import { poolPromise, sql } from "@/app/api/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  console.log("ID:", id);
  const authResult = await verifyAuthToken(req);
  if (!authResult)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("NumeroConvention", sql.Int, id);
    const result = await request.execute("Ps_ListeContratConvention");
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
}
