import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { verifyAuthToken } from "@/app/api/lib/auth";
import { ReportData, SourceData, transformToReportData } from "./utility"; // Assurez-vous que ReportData est bien l'interface pour un seul rapport
import { generateReportHtmlContent } from "@/app/api/contrat/generate-pdf/avis/route";

// Le reportData statique n'est plus pertinent ici puisque nous allons boucler sur data.data
// const reportData = { ... };

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  console.log("Appel: \n\n");
  const param = await context.params;
  const police = param.id;
  const year = req.nextUrl.searchParams.get("ANNEE");
  console.log("La police est : ", police);
  const authResult = verifyAuthToken(req);

  if (!authResult) {
    return new Response("Le token n'est pas valide", { status: 401 });
  }

  let token = req.headers.get("authorization");

  console.log("Mon token", token);

  if (!token?.startsWith("Bearer")) {
    return new Response(
      "Le token est obligatoire et doit commencer par la chaine Bearer ",
      { status: 401 }
    );
  }
  token = token.split(" ")[1];

  if (police == null || year == null) {
    return new Response("Error: La police et l'année sont obligatoire", {
      status: 400,
    });
  }
  console.log("Avant appel donnée :\n\n\n");
  const response = await fetch(
    `http://localhost:3000/api/corporate/${police}/avis?ANNEE=${year}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    return new Response("Problème de récupération des données de l'API", {
      status: 400,
    });
  }

  const data = await response.json();
  console.log("Avant conversion :\n\n\n");
  if (!data.data || data.data.length === 0) {
    return new Response("Aucun avis trouvé pour votre police", { status: 400 });
  }

  const reportsData: ReportData[] = data.data.map((item: any) =>
    transformToReportData(item)
  );

  console.log("Après conversion :\n\n\n");

  if (reportsData.length === 0) {
    return NextResponse.json(
      { message: "Aucune donnée de rapport disponible après transformation." },
      { status: 400 }
    );
  }

  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Générer le HTML pour chaque rapport et les joindre avec un saut de page
    const allReportsHtml = reportsData
      .map((report, index) => {
        const reportHtml = generateReportHtmlContent(report, year);
        return reportHtml;
      })
      .join("\n");

    // Encapsulez le tout dans un document HTML complet
    const finalHtmlContent = `
      
        ${allReportsHtml}
      
    `;

    await page.setContent(finalHtmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "15mm",
        bottom: "20mm",
        left: "15mm",
      },
    });

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="rapports_situation.pdf"',
      },
    });
  } catch (error: any) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { message: "Failed to generate PDF", error: error.message },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
