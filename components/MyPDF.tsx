// components/CotisationsPDF.tsx
import { CotisationClientIndiv } from "@/app/Types/type";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Exemple de données fictives, à remplacer par des props
const cotisations = [
  {
    NumeroQuittance: "Q-001",
    Echeance: "2025-06-01",
    DebutPeriode: "2025-05-01",
    FinPeriode: "2025-05-31",
    MontantEmis: 15000,
    PrimePeriodique: 12000,
    EcheanceAvance: 1000,
    MontantEncaisse: 14000,
    MontantRegularise: 1000,
    EtatQuittance: "Payée",
  },
  // ... d'autres lignes
];

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
  },
  table: {
    display: "table",
    width: "auto",
    marginVertical: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#aaa",
  },
  row: {
    flexDirection: "row",
  },
  header: {
    backgroundColor: "#eee",
    fontWeight: "bold",
  },
  cell: {
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexGrow: 1,
    textAlign: "center",
  },
  lastCell: {
    borderRightWidth: 0,
  },
});

const headers = [
  "NUMÉRO QUITTANCE",
  "DATE QUITTANCE",
  "DÉBUT PÉRIODE",
  "FIN PÉRIODE",
  "MONTANT ÉMIS",
  "PRIME PÉRIODIQUE",
  "REMBOURSEMENT AVANCE",
  "MONTANT ENCAISSÉ",
  "MONTANT RÉGULARISÉ",
  "ÉTAT QUITTANCE",
];

const CotisationsPDF = ({ data }: { data: CotisationClientIndiv[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={{ textAlign: "center", fontSize: 14, marginBottom: 10 }}>
        Liste des cotisations
      </Text>

      <View style={styles.table}>
        {/* Header */}
        <View style={[styles.row, styles.header]}>
          {headers.map((header, i) => (
            <Text
              key={header}
              style={[styles.cell, i == headers.length - 1 && styles.lastCell]}
            >
              {header}
            </Text>
          ))}
        </View>

        {/* Rows */}
        {data.map((c, rowIndex) => (
          <View style={styles.row} key={rowIndex}>
            <Text style={styles.cell}>{c.NumeroQuittance}</Text>
            <Text style={styles.cell}>
              {new Date(c.Echeance).toLocaleDateString("fr-FR")}
            </Text>
            <Text style={styles.cell}>
              {new Date(c.DebutPeriode).toLocaleDateString("fr-FR")}
            </Text>
            <Text style={styles.cell}>
              {new Date(c.FinPeriode).toLocaleDateString("fr-FR")}
            </Text>
            <Text style={styles.cell}>{c.MontantEmis} FCFA</Text>
            <Text style={styles.cell}>{c.PrimePeriodique} FCFA</Text>
            <Text style={styles.cell}>{c.EcheanceAvance} FCFA</Text>
            <Text style={styles.cell}>{c.MontantEncaisse} FCFA</Text>
            <Text style={styles.cell}>{c.MontantRegularise} FCFA</Text>
            <Text style={[styles.cell, styles.lastCell]}>
              {c.EtatQuittance}
            </Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default CotisationsPDF;
