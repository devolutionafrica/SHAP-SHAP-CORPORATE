import { verifyAuthToken } from "@/app/lib/auth";
import { poolPromise, sql } from "@/app/lib/db";
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

  const dateDebut = req.nextUrl.searchParams.get("dateDebut");
  const dateFin = req.nextUrl.searchParams.get("dateFin");
  if (!dateDebut || !dateFin) {
    return NextResponse.json(
      { error: "Missing dateDebut or dateFin parameters" },
      { status: 400 }
    );
  }

  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("NumeroConvention", sql.Int, id);
    request.input("VarDateDebut", sql.VarChar, dateDebut);
    request.input("VarDateFin", sql.VarChar, dateFin);
    const result = await request.execute(
      "Ps_ConsultationCotisationClientgroup"
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
}
