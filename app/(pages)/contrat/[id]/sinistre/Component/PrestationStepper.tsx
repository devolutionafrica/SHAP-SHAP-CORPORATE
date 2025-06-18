"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

// Définir les types pour les données du formulaire
interface PrestationFormData {
  typePrestation: string;
  description: string;
  numeroSinistreAssocie?: string;
  isContratEligible: boolean; // Résultat de l'étape 1
  datePrestation: string;
  montantEstime?: number;
  documentsJoints?: File[]; // Pourrait être plus complexe avec un vrai upload
  contactUrgenceNom?: string;
  contactUrgenceTelephone?: string;
  isUrgent: boolean;
  // Ajoutez d'autres champs pertinents
}

interface PrestationStepperProps {
  onClose: () => void; // Fonction pour fermer la modale parent
  sinistreId?: string; // Optionnel, si la demande est liée à un sinistre existant
}

export default function PrestationStepper({
  onClose,
  sinistreId,
}: PrestationStepperProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PrestationFormData>({
    typePrestation: "",
    description: "",
    isContratEligible: false, // Initialement non éligible
    datePrestation: new Date().toISOString().split("T")[0], // Date du jour par défaut
    isUrgent: false,
  });
  const [eligibilityChecked, setEligibilityChecked] = useState(false); // Pour savoir si l'utilisateur a cliqué sur "vérifier"

  const totalSteps = 3;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [id]: checked }));
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    if (validateStep(totalSteps)) {
      console.log("Données de la demande de prestation soumises :", formData);
      toast({
        title: "Demande de prestation soumise !",
        description:
          "Votre demande a été envoyée avec succès. Nous vous contacterons bientôt.",
      });
      onClose();
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!eligibilityChecked) {
          toast({
            title: "Vérification requise",
            description: "Veuillez vérifier l'éligibilité du contrat.",
            variant: "destructive",
          });
          return false;
        }
        if (!formData.isContratEligible) {
          toast({
            title: "Contrat non éligible",
            description: "Ce contrat n'est pas éligible pour une prestation.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 2:
        if (
          !formData.typePrestation ||
          !formData.description ||
          !formData.datePrestation
        ) {
          toast({
            title: "Champs manquants",
            description:
              "Veuillez remplir tous les champs obligatoires de la prestation.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const checkEligibility = () => {
    setEligibilityChecked(true);
    const isEligible = Math.random() > 0.5;
    setFormData((prev) => ({ ...prev, isContratEligible: isEligible }));
    if (isEligible) {
      toast({
        title: "Contrat éligible",
        description: "Le contrat est éligible à une prestation.",
      });
    } else {
      toast({
        title: "Contrat non éligible",
        description:
          "Le contrat n'est pas éligible à une prestation. Veuillez contacter le support.",
        variant: "destructive",
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <CardContent className="space-y-3">
            <h3 className="text-lg font-semibold">
              Étape 1: Vérification d'éligibilité
            </h3>
            <p className="text-sm text-gray-600">
              Vérifiez si le contrat est éligible pour la prestation demandée.
            </p>
            {sinistreId && (
              <p className="text-sm text-blue-600">
                Demande liée au sinistre ID : <strong>{sinistreId}</strong>
              </p>
            )}

            <div className="flex items-center space-x-2 mt-4">
              <Button onClick={checkEligibility} disabled={eligibilityChecked}>
                {eligibilityChecked
                  ? "Éligibilité vérifiée"
                  : "Vérifier l'éligibilité"}
              </Button>
              {eligibilityChecked && (
                <span
                  className={`font-bold ${
                    formData.isContratEligible
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formData.isContratEligible ? "Éligible" : "Non éligible"}
                </span>
              )}
            </div>
            {!eligibilityChecked && (
              <p className="text-xs text-gray-500 mt-2">
                Cliquez sur le bouton pour simuler la vérification
                d'éligibilité.
              </p>
            )}
          </CardContent>
        );
      case 2:
        return (
          <div className="space-y-4 p-4">
            <h3 className="text-lg font-semibold">
              Étape 2: Informations sur la Prestation
            </h3>
            <div className="grid gap-2">
              <Label htmlFor="typePrestation">Type de Prestation *</Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("typePrestation", value)
                }
                value={formData.typePrestation}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reparation">
                    Réparation Véhicule
                  </SelectItem>
                  <SelectItem value="indemnisation">
                    Demande d'Indemnisation
                  </SelectItem>
                  <SelectItem value="assistance">
                    Assistance Routière
                  </SelectItem>
                  <SelectItem value="expertise">Demande d'Expertise</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">
                Description de la Prestation *
              </Label>
              <Textarea
                id="description"
                placeholder="Décrivez en détail la prestation demandée..."
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="datePrestation">
                Date souhaitée de la prestation *
              </Label>
              <Input
                id="datePrestation"
                type="date"
                value={formData.datePrestation}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="numeroSinistreAssocie">
                Numéro de Sinistre Associé (optionnel)
              </Label>
              <Input
                id="numeroSinistreAssocie"
                type="text"
                placeholder="Ex: S-2023-XXXXX"
                value={formData.numeroSinistreAssocie || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isUrgent"
                checked={formData.isUrgent}
                onCheckedChange={(checked: boolean) =>
                  handleCheckboxChange("isUrgent", checked)
                }
              />
              <label
                htmlFor="isUrgent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Cocher si la demande est urgente
              </label>
            </div>
          </div>
        );
      case 3:
        return (
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">Étape 3: Récapitulatif</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Type de Prestation:</strong>{" "}
                {formData.typePrestation || "Non renseigné"}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {formData.description || "Non renseignée"}
              </p>
              <p>
                <strong>Date souhaitée:</strong>{" "}
                {formData.datePrestation || "Non renseignée"}
              </p>
              <p>
                <strong>N° Sinistre Associé:</strong>{" "}
                {formData.numeroSinistreAssocie || "Aucun"}
              </p>
              <p>
                <strong>Demande Urgente:</strong>{" "}
                {formData.isUrgent ? "Oui" : "Non"}
              </p>
              <p>
                <strong>Éligibilité du Contrat:</strong>{" "}
                <span
                  className={`font-bold ${
                    formData.isContratEligible
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formData.isContratEligible ? "Éligible" : "Non éligible"}
                </span>
              </p>
              {/* Ajoutez d'autres champs du formulaire ici */}
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Veuillez vérifier toutes les informations avant de soumettre.
            </p>
          </CardContent>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        {/* <CardTitle className="text-2xl text-center">
          Nouvelle Demande de Prestation
        </CardTitle> */}
        <CardDescription className="text-center">
          Étape {currentStep} sur {totalSteps}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </CardDescription>
      </CardHeader>
      {renderStepContent()}
      <CardFooter className="flex justify-between mt-4">
        {currentStep > 1 && (
          <Button variant="outline" onClick={handlePrevious}>
            Précédent
          </Button>
        )}
        <div className="flex-grow"></div> {/* Espaceur */}
        {currentStep < totalSteps && (
          <Button
            onClick={handleNext}
            disabled={!eligibilityChecked && currentStep === 1}
          >
            Suivant
          </Button>
        )}
        {currentStep === totalSteps && (
          <Button onClick={handleSubmit}>Soumettre la Demande</Button>
        )}
      </CardFooter>
    </Card>
  );
}
