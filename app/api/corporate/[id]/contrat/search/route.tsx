import { verifyAuthToken } from "@/app/api/lib/auth";
import { poolPromise, sql } from "@/app/api/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  console.log("ID:", id);
  const policeId = req.nextUrl.searchParams.get("contrat");
  const name = req.nextUrl.searchParams.get("name");
  const authResult = await verifyAuthToken(req);
  if (!authResult)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("NumeroConvention", sql.Int, id);
    const result = await request.execute("Ps_ListeContratConvention");
    const data = result.recordset;
    const filter: any[] = [];
    data.map((item: any) => {
      if (item.NomAssure != null && item.PrenomsAssure != null) {
        if (
          item.NUMERO_POLICE.includes(policeId) ||
          item.NomAssure.includes(name) ||
          item.PrenomsAssure.includes(name)
        ) {
          filter.push(item);
        }
      } else {
        if (item.NUMERO_POLICE.includes(policeId)) {
          filter.push(item);
        }
      }
    });
    return NextResponse.json({
      data: filter,
      sizes: filter.length,
    });
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
