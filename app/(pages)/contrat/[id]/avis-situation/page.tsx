"use client";

import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import NotFound from "@/public/avis_not_found.svg";
import Image from "next/image";
import dayjs from "dayjs";
import { Select } from "@mui/material";
import YearSelector from "./Components/YearSelector";
const ReportViewerAndDownloader = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPdf, setShowPdf] = useState(false);
  const currentYear = dayjs().year();
  const [selectedYear, setSelectedYead] = useState(currentYear - 1);

  const param = useParams();

  const id = param.id;

  const apiUrl = `/api/contrat/generate-pdf/avis?police=${id}&ANNEE=${selectedYear}`;

  const fetchAndDisplayPdf = async () => {
    setLoading(true);
    setError(null);
    setPdfUrl(null);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (!response.ok) {
        let errorMessage = `Erreur HTTP: ${response.status} ${response.statusText}`;

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {}
        throw new Error(errorMessage);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
      setShowPdf(true);
    } catch (err: any) {
      console.error(
        "Erreur lors de la récupération ou de l'affichage du PDF:",
        err
      );
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    if (pdfUrl) {
      const a = document.createElement("a");
      a.href = pdfUrl;

      a.download = "rapport_avis.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      alert(
        "Aucun PDF n'est chargé pour le téléchargement. Veuillez d'abord l'afficher."
      );
    }
  };

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        window.URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  return (
    <div
      style={{ padding: "20px", textAlign: "center" }}
      className="my-12 shadow-lg w-auto rounded-sm"
    >
      <div className="items-center flex flex-col">
        <h1 className="font-extrabold">Rapport de Situation</h1>

        <div className="max-w-[220px]">
          <YearSelector
            onSelectYear={setSelectedYead}
            selectedYear={selectedYear}
          />
        </div>

        <div className="flex flex-row my-4">
          <button
            onClick={
              showPdf == false ? fetchAndDisplayPdf : () => setShowPdf(false)
            }
            disabled={loading}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#223268",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              marginRight: "10px",
            }}
          >
            {loading
              ? "Chargement du PDF..."
              : showPdf == true
              ? "Masquer le PDF"
              : "Afficher le PDF"}
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={!pdfUrl || loading}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#ca9a2c",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: !pdfUrl || loading ? "not-allowed" : "pointer",
              opacity: !pdfUrl || loading ? 0.9 : 1,
            }}
          >
            Télécharger le PDF
          </button>
        </div>
      </div>

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>Erreur: {error}</p>
      )}
      {loading && <p>Génération et chargement du PDF...</p>}

      {pdfUrl && !loading && showPdf && (
        <div
          style={{
            marginTop: "20px",
            width: "100%",
            maxWidth: "800px",
            height: "600px",
            margin: "0 auto",
            border: "1px solid #ddd",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <iframe
            src={pdfUrl}
            title="Aperçu du rapport"
            width="100%"
            height="100%"
            className="border-2 rounded-lg"
            // Vous pouvez ajouter allowFullScreen si nécessaire
          >
            Votre navigateur ne supporte pas les iframes, ou le PDF ne peut pas
            être affiché.
          </iframe>
        </div>
      )}

      {!pdfUrl && !loading && !error && (
        <p style={{ marginTop: "20px", color: "#555" }}>
          Cliquez sur "Afficher le PDF" pour générer et voir le rapport ici.
        </p>
      )}
      {!loading && error && (
        <div className="p-8 bg-blue-50 shadow-lg my-8 max-w-2xl mx-auto rounded-lg text-[black] flex flex-col gap-8 items-center ">
          <div>
            <Image src={NotFound} alt="Not Found" width={200} />
          </div>
          <div className="font-bold text-lg">
            Aucun avis n'a été trouvé pour cette police.
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportViewerAndDownloader;
