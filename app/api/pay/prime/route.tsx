import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "../../lib/auth";
import { PayData, SuiviPaiementQuittanceLog } from "@/app/Types/type";
import { ConnectionPool } from "mssql";
import { poolPromise } from "@/lib/db";

export async function POST(request: NextRequest) {
  /*
    

    Cette méthode permet de rendre effective le payement sur sunsine après que la prime ait été payez par l'opérateur
    Liste des tables impactées lors de la validation de payement sur sunshine
    - Suivi_PAIEMENT_Quittance_Detail
    - Suivi_PAIEMENT_Quittance_LOG
    - SUIVI_Suivi_PAIEMENT_Quittances
    - Suivi_PAIEMENT_Quittance_PGI

    */
  const verifToken = verifyAuthToken(request);
  if (verifToken == null) {
    return NextResponse.json(
      {
        message: "Votre token n'est plus valide",
      },
      {
        status: 401,
        statusText: "Token invalide",
      }
    );
  }

  //verification des donn
  const { data }: { data: PayData } = await request.json();
  console.log("Donnée reçue", data);
  try {
    verification(data);
  } catch (e) {
    return NextResponse.json(
      {},
      {
        status: 500,
        statusText: e instanceof Error ? e.message : "Unknown error",
      }
    );
  }

  try {
    const pool = await poolPromise;
    saveSuiviePaiementQuittanceLog(data, pool);
  } catch (e: any) {
    return NextResponse.json(
      {},
      {
        status: 500,
        statusText: e.message(),
      }
    );
  }
}

export const verification = (data: PayData) => {
  if (data.quittances.length == 0) {
    throw new Error("Il doit avoir obligatoirement une quitances");
  }
  if (data.montant == null) {
    throw new Error("Le montant ne peut pas être vide");
  }
  if (data.numero == null) {
    throw new Error("Le numero ne peut pas être vide");
  }
};

//ajouter dans Suivi_PAIEMENT_Quittance_log

export const saveSuiviePaiementQuittanceLog = async (
  data: PayData,
  pool: any
) => {
  const date = Date.now().toLocaleString();
  const telephone = data.numero;

  try {
    const formatReq = (item: SuiviPaiementQuittanceLog) =>
      `INSERT INTO Suivi_PAIEMENT_Quittance_log(NumeroQuittance, NumeroPolice, MontantQuittance, DateEnregistrement, Telephone) 
 VALUES ('${item.numeroQuittance}', '${item.numeroPolice}', ${item.montantQuittance}, '${item.dateEnregistrement}', '${item.telephone}')`;
    for (var item of data.quittances) {
      if (item.MontantEmis != null) {
        const suivi: SuiviPaiementQuittanceLog = {
          dateEnregistrement: date,
          numeroPolice: item.NumeroPolice,
          montantQuittance: item.MontantEmis,
          telephone: telephone,
          numeroQuittance: item.NumeroQuittance,
        };
        const req = (await pool).request();
        req.execute(formatReq(suivi));
      }
    }
  } catch (e) {
    return NextResponse.json({}, { status: 500 });
  }
};
