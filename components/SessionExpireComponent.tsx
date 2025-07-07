// components/SessionExpireComponent.tsx
"use client"; // Assurez-vous que c'est un composant client

import Image from "next/image";
import { AlertDialogHeader } from "./ui/alert-dialog";
// Importez le composant Dialog principal de shadcn/ui
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
export default function SessionsExpireComponent({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const setSessionExpireCount = useUserStore(
    (state) => state.setCountSessionExpire
  );
  const handleReconnect = () => {
    onClose();
    setSessionExpireCount();
    router.push("/login"); // Redirige vers la page de connexion
  };

  return (
    // Utilisez le composant Dialog de shadcn/ui ici
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:!max-h-full p-6 bg-white rounded-lg shadow-xl">
        {/* Si AlertDialogHeader n'est pas nécessaire, vous pouvez le remplacer par un simple div ou Fragment */}
        <AlertDialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-red-600 mb-4">
            Session expirée !
          </DialogTitle>
        </AlertDialogHeader>
        <div className="mt-4 text-center text-gray-700">
          <div className="flex justify-center mb-4">
            <Image src={"/nsiavie.png"} width={120} height={120} alt="LOGO" />
          </div>
          <p className="mb-4">
            Votre session a expiré. Veuillez vous reconnecter pour continuer.
          </p>

          <div className="!overflow-y-auto max-h-[450px]">
            {/* Contenu additionnel ici si nécessaire */}
          </div>
          <button
            onClick={handleReconnect}
            className="mt-6 px-6 py-3 bg-[#223268] hover:bg-blue-700 text-white font-semibold rounded-md shadow-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Se reconnecter
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
