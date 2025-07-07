"use client";

import { CotisationClientIndiv, Integrageur, PayData } from "@/app/Types/type";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // Assurez-vous d'avoir ce composant de Shadcn
import { Input } from "@/components/ui/input"; // Assurez-vous d'avoir ce composant de Shadcn
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Assurez-vous d'avoir ce composant de Shadcn
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion"; // Pour les animations
import { usePayValidation } from "@/hooks/usePayValidation";
import { useIntegrateur } from "@/hooks/useIntegrateur";
import { useIntegrateurStore } from "@/store/useIntegrateurStore";
import { FILE } from "dns";

// Schéma de validation Zod pour le formulaire de paiement mobile
const formSchema = z.object({
  operateur: z.enum(["Orange", "Wave", "Moov"], {
    required_error: "Veuillez sélectionner un opérateur.",
  }),
  numero: z
    .string()
    .min(8, { message: "Le numéro doit contenir au moins 8 chiffres." })
    .max(15, { message: "Le numéro ne peut pas dépasser 15 chiffres." })
    .regex(/^\d+$/, {
      message: "Le numéro doit contenir uniquement des chiffres.",
    }),
});

/**
 * Composant de modal pour le règlement de prime
 * Permet à l'utilisateur de choisir un intégrateur et de saisir les détails du paiement mobile
 */

export default function ReglementPrimeModal({
  data,
}: {
  data?: CotisationClientIndiv | null;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedIntegrator, setSelectedIntegrator] =
    useState<Integrageur | null>(null);

  const router = useRouter();

  const useQuery = useIntegrateur();
  const useStore = useIntegrateurStore();
  const integrateurs = useIntegrateurStore((state) => state.integrateurs);

  const loadIntegrateurs = async () => {
    try {
      const result = await useQuery.refetch();
      console.log(
        "Résultat de la requête d'intégrateurs :",
        result.data.data.length
      );

      if (result.data.data.length > 0) {
        const filteredIntegrateurs = result.data.data.filter(
          (integrateur: Integrageur) => integrateur.IS_ACTIF == true
        );
        useStore.setIntegrateurs(filteredIntegrateurs);
        console.log("Intégrateurs filtrés :", filteredIntegrateurs);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des intégrateurs :", error);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      operateur: undefined, // undefined initialement pour le select
      numero: "",
    },
  });

  // const integrateurs: Integrageur[] = [
  //   {
  //     logo: "/INTEGRATEURS/kkiapay.png",
  //     libelle: "KKIA PAY",
  //     idOperateur: 1,
  //     isActif: 1,
  //   },
  //   {
  //     logo: "/INTEGRATEURS/afrikpay.png",
  //     libelle: "AFRIK PAY",
  //     urlApi:
  //       "https://developers.api.oss.afrikpay.com/api/secure/form/ecommerce/checkout/payment/",
  //     urlApiRetour:
  //       "https://developers.api.oss.afrikpay.com/api/secure/form/ecommerce/checkout/payment/",
  //     idOperateur: 2,
  //     isActif: 1,
  //   },
  // ];

  const handleSelectIntegrateur = (integrator: Integrageur) => {
    setSelectedIntegrator(integrator);
    setCurrentStep(2);
  };

  const handleBackToIntegratorSelection = () => {
    setSelectedIntegrator(null);
    setCurrentStep(1);
    form.reset();
  };

  const payMutation = usePayValidation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Données du formulaire mobile :", values);

    const payData: PayData = {
      devise: "XOF",
      codeFiliale: "CM",
      codeOperateur: values.operateur,
      descriptionPayement: "Payment de la quittance",
      codeStatutTransaction: "SUCC",
      montant: data?.MontantEmis !== undefined ? String(data.MontantEmis) : "",
      numecorClient: values.numero,
      numero: String(data?.NumeroPolice),
      operateur: values.operateur,
      OTPcode: "",
      referenceId: "",
      refTransaction: "",
      quittances: [data!],
    };

    console.log("Donnée envoyée", payData);

    try {
      await payMutation.mutateAsync(
        { data: payData },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            alert(
              `Paiement de ${data?.PrimePeriodique} XOF via ${values.operateur} (${values.numero}) en cours...`
            );
          },
          onError: (e) => {
            alert("Une erreur est survenue");
            console.log(e);
          },
        }
      );
    } catch (e) {}
  }

  useEffect(() => {
    loadIntegrateurs();
  }, [isModalOpen]);

  return (
    <div className="">
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);

          if (!open) {
            setSelectedIntegrator(null);
            setCurrentStep(1);
            form.reset();
          }
        }}
      >
        <DialogTrigger asChild>
          <Button className="!bg-[#223268] !text-white !normal-case !text-xs  !px-3 hover:!bg-[#1a254d] transition-colors duration-300 transform hover:scale-105">
            Régler
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] md:!max-w-md bg-gradient-to-br from-[#223268] to-[#1a254d] text-white shadow-2xl rounded-lg p-6 overflow-y-auto custom-scrollbar max-h-[550px]">
          <AlertDialogHeader>
            <DialogTitle className="text-3xl font-extrabold text-center text-yellow-300 drop-shadow-lg animate-pulse">
              Règlement de prime
            </DialogTitle>
            <DialogDescription className="text-center text-gray-200 mt-2">
              Effectuez votre paiement en toute sécurité.
            </DialogDescription>
          </AlertDialogHeader>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-4 text-center text-lg space-y-1 bg-white/10 p-4 rounded-md shadow-inner"
          >
            <p className="text-gray-100">
              Police:{" "}
              <span className="font-semibold text-yellow-300">
                {data?.NumeroPolice}
              </span>
            </p>
            <p className="text-gray-100">
              Prime Périodique:{" "}
              <span className="font-semibold text-yellow-300">
                {data?.PrimePeriodique} XOF
              </span>
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className="my-6 overflow-auto custom-scrollbar"
              >
                <p className="text-lg font-semibold mb-4 text-center text-gray-100">
                  Veuillez choisir un moyen de paiement
                </p>
                <div className="flex flex-row flex-wrap gap-4 justify-center">
                  {useQuery.isSuccess &&
                    integrateurs != null &&
                    useQuery.isSuccess &&
                    integrateurs.map((item) => (
                      <motion.div
                        key={item.IDE_OPERATEUR}
                        className={`bg-white/10 p-3 rounded-lg shadow-md cursor-pointer
                                       border-4 transition-all duration-300 ease-in-out
                                       ${
                                         selectedIntegrator?.IDE_OPERATEUR ===
                                         item.IDE_OPERATEUR
                                           ? "border-[#ca9a2c] scale-105 transform ring-4 ring-[#ca9a2c]/50"
                                           : "border-transparent hover:border-gray-400 hover:scale-[1.02]"
                                       }`}
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 0 20px rgba(202, 154, 44, 0.5)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSelectIntegrateur(item)}
                      >
                        <Image
                          src={`/INTEGRATEURS/` + item.LOGO}
                          alt={item.LIBELLE}
                          width={120} // Taille des logos pour une meilleure présentation
                          height={120}
                          objectFit="contain" // Assure que le logo entier est visible
                          className="rounded-sm mb-2"
                        />
                        <p className="text-white font-semibold text-center text-sm mt-1">
                          {item.LIBELLE}
                        </p>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && selectedIntegrator && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="my-6"
              >
                <div className="flex flex-col items-center gap-4 mb-6">
                  <p className="text-lg font-semibold text-center text-gray-100">
                    Vous avez choisi{" "}
                    <span className="text-yellow-300">
                      {selectedIntegrator.LIBELLE}
                    </span>{" "}
                    pour régler votre Prime
                  </p>
                  <Image
                    src={`/INTEGRATEURS/` + selectedIntegrator.LOGO}
                    width={150} // Taille plus grande pour le logo sélectionné
                    height={150}
                    objectFit="contain"
                    alt={selectedIntegrator.LIBELLE}
                    className="rounded-lg shadow-lg border-2 border-[#ca9a2c] animate-bounce-slow"
                  />
                </div>

                {/* Formulaire pour l'opérateur et le numéro */}
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="operateur"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-md">
                            Opérateur Mobile
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white focus:ring-[#ca9a2c] transition-all duration-300">
                                <SelectValue placeholder="Sélectionnez votre opérateur" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-800 text-white border-gray-700">
                              <SelectItem value="Orange">Orange</SelectItem>
                              <SelectItem value="Wave">Wave</SelectItem>
                              <SelectItem value="Moov">Moov</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-300" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="numero"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-md">
                            Votre Numéro
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: 07xxxxxx"
                              type="tel"
                              className="w-full px-4 py-3 rounded text-black"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-300" />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <div className="flex justify-between w-full mt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleBackToIntegratorSelection}
                          className="!bg-gray-700 !text-white border-gray-600 hover:!bg-gray-600 transition-colors duration-300"
                        >
                          Retour
                        </Button>
                        <Button
                          type="submit"
                          className="!bg-[#ca9a2c] !text-white hover:!bg-[#e0b54d] transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          Procéder au Paiement
                        </Button>
                      </div>
                    </DialogFooter>
                  </form>
                </Form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dialog Footer for Step 1 (if needed, otherwise removed) */}
          {currentStep === 1 && (
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="!bg-gray-700 !text-white border-gray-600 hover:!bg-gray-600 transition-colors duration-300"
              >
                Annuler
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
