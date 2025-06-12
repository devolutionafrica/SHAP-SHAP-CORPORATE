import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { verifyAuthToken } from "../../lib/auth";
import { SourceData, transformToReportData } from "./utility";

const reportData = {
  policeNumber: "21610858/0025543",
  effectiveDate: "01/06/2017 00:00:00",
  insuredNumber: "1035762",
  contractType: "NSIA RETRAITE",
  cityDate: "Conakry, le mercredi 28 mai 2025",
  subscriberName: "DIOUF MAIMOUNA",
  subscriberAddress: "BP 6050",
  accountStatementDate: "31/12/2024",
  evolution2024: {
    capitalAcquiredJan1: "29 083 610",
    grossContributions2024: "3 364 298",
    netContributions2024: "3 581 040",
    exceptionalPayment2024: "0",
    netInterestAcquired2024: "1 091 898",
    profitSharing2023: "0",
    partialRedemptions2024: "0",
    assetManagementFees2024: "- 322 801",
    capitalAcquiredDec31: "33 433 747",
  },
};

function generateReportHtmlContent(reportData: any) {
  // Styles CSS pour le PDF
  const styles = `
    <style>
      body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 20px; font-size: 10px; }
      .container { width: 100%; max-width: 800px; margin: 0 auto; border: 1px solid #eee; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
      .header { text-align: center; margin-bottom: 20px; }
      .header h1 { color: #223268; margin-bottom: 5px; font-size: 16px; }
      .header p { font-size: 9px; color: #666; margin-top: 0; }
      .section-title { background-color: #223268; color: white; padding: 5px 10px; margin-top: 20px; margin-bottom: 10px; font-size: 12px; }
      .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px 15px; margin-bottom: 10px; }
      .info-grid div strong { color: #333; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
      th, td { border: 1px solid #ddd; padding: 6px; text-align: left; vertical-align: top; }
      th { background-color: #f2f2f2; color: #333; font-weight: bold; font-size: 9px; }
      td { font-size: 9px; color: #555; }
      .text-right { text-align: right; }
      .footer-note { font-size: 8px; color: #999; margin-top: 30px; text-align: right; }
    </style>
  `;

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rapport de Contrat</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>NSIA VIE ASSURANCES</h1>
          <p>${reportData.cityDate}</p>
        </div>

        <div class="info-grid">
          <div><strong>Numéro police :</strong> ${reportData.policeNumber}</div>
          <div><strong>Date effet :</strong> ${reportData.effectiveDate}</div>
          <div><strong>Numéro Assuré :</strong> ${reportData.insuredNumber}</div>
          <div><strong>Type Contrat :</strong> ${reportData.contractType}</div>
        </div>

        <p><strong>${reportData.subscriberName}</strong><br>${reportData.subscriberAddress}</p>

        <div class="section-title">AVIS DE SITUATION AU ${reportData.accountStatementDate}</div>
        <p>Cher souscripteur, Après l'arrêté des comptes au ${reportData.accountStatementDate} de NSIA Vie Assurances, filiale du Groupe NSIA, nous avons le plaisir de vous communiquer la situation de votre compte épargne qui s'établit comme suit :</p>
        
        <div class="section-title">Evolution au cours de l'exercice 2024 (en XOF)</div>
        <table>
          <tr><td>- Montant du capital acquis au 01/01/2024 :</td><td class="text-right">${reportData.evolution2024.capitalAcquiredJan1}</td></tr>
          <tr><td>- Cumul des Cotisations brutes de l'exercice 2024 :</td><td class="text-right">${reportData.evolution2024.grossContributions2024}</td></tr>
          <tr><td>- Cumul des Cotisations nettes de l'exercice 2024 :</td><td class="text-right">${reportData.evolution2024.netContributions2024}</td></tr>
          <tr><td>- Versement exceptionnel ou régularisation de primes effectué en 2024 :</td><td class="text-right">${reportData.evolution2024.exceptionalPayment2024}</td></tr>
          <tr><td>- Interêts nets acquis au cours de l'exercice 2024 :</td><td class="text-right">${reportData.evolution2024.netInterestAcquired2024}</td></tr>
          <tr><td>- Participations aux bénéfices de l'année 2023 :</td><td class="text-right">${reportData.evolution2024.profitSharing2023}</td></tr>
          <tr><td>- Rachats partiels, régularisations d'avances ou primes impayés en 2024 :</td><td class="text-right">${reportData.evolution2024.partialRedemptions2024}</td></tr>
          <tr><td>- Frais sur actif gérés de l'exercice 2024 :</td><td class="text-right">${reportData.evolution2024.assetManagementFees2024}</td></tr>
          <tr><td><strong>CAPITAL ACQUIS AU 31/12/2024 :</strong></td><td class="text-right"><strong>${reportData.evolution2024.capitalAcquiredDec31}</strong></td></tr>
        </table>
        
        <p>Nous vous rappelons que cet avis tient uniquement compte de la situation de votre épargne telle que connue par nos services au ${reportData.accountStatementDate}. Pour toutes informations relatives au présent avis de situation, veuillez contacter le Call Center de NSIA VIE ASSURANCES au 629 00 00 20. Par ailleurs, toute réclamation relative aux informations indiquées ci-dessus doit nous être adressée à l’adresse ci-après : nsiaviecameroom@groupensia.com. Nous vous souhaitons une bonne réception de ce document et vous remercions de votre confiance. Nous vous prions de croire, cher souscripteur, en l'expression de nos meilleures salutations.</p>
        <p class="footer-note">Pour NSIA Vie Assurances<br/>*Cet avis ne nécessite pas de signature.</p>
      </div>
    </body>
    </html>
  `;
}

export async function POST(req: NextRequest) {
  const police = await req.nextUrl.searchParams.get("police");

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

  if (police == null) {
    return new Response("Error: La police est obligatoire", { status: 400 });
  }

  const response = await fetch(
    `http://localhost:3000/api/corporate/${police}/avis`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    return new Response("Problème de recupération des données de l'api", {
      status: 400,
    });
  }

  const data = await response.json();

  if (data.data.length == 0) {
    return new Response("Aucun avis trouvé pour votre police", { status: 400 });
  }

  const sourceData = data!.data[0];

  let reportData = {};

  reportData = transformToReportData(sourceData);

  if (!reportData) {
    return NextResponse.json(
      { message: "Report data is required." },
      { status: 400 }
    );
  }

  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const htmlContent = generateReportHtmlContent(reportData);

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

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
        "Content-Disposition": 'attachment; filename="rapport_situation.pdf"',
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
