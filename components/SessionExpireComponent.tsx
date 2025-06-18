// components/SessionExpireComponent.tsx
import { Dialog as MuiDialog } from "@mui/material"; // Renommé pour éviter la confusion
import { DialogContent, DialogTitle } from "./ui/dialog"; // Supprimé DialogTrigger
import { AlertDialogHeader } from "./ui/alert-dialog";
// Importez useRouter si vous voulez rediriger l'utilisateur après un clic sur "Reconnecter"
import { useRouter } from "next/navigation"; // Ou 'next/router' si vous êtes en Pages Router

// Le composant doit accepter des props pour contrôler son ouverture/fermeture
export default function SessionsExpireComponent({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  const handleReconnect = () => {
    // Ici, vous pouvez ajouter une logique de déconnexion propre si elle n'est pas déjà dans l'intercepteur
    // (ex: effacer d'autres données utilisateur spécifiques)
    // Ensuite, redirigez l'utilisateur vers la page de connexion
    onClose(); // Ferme la modale
    router.push("/login"); // Redirige vers la page de connexion
  };

  return (
    <div>
      {/* Utilisez la prop 'open' pour contrôler l'ouverture de la modale MUI */}
      {/* Utilisez 'onClose' pour permettre à la modale de se fermer, typiquement quand l'utilisateur clique en dehors */}
      <MuiDialog open={open} onClose={onClose}>
        <DialogContent className="sm:max-w-[425px] md:!max-h-full md:max-w-[70%] p-6 bg-white rounded-lg shadow-xl">
          <AlertDialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-red-600 mb-4">
              Session expirée !
            </DialogTitle>
          </AlertDialogHeader>
          <div className="mt-4 text-center text-gray-700">
            <p className="mb-4">
              Votre session a expiré. Veuillez vous reconnecter pour continuer.
            </p>
            {/* Le contenu du modal sera ici. Le overflow-y-scroll n'est pertinent que si le contenu est grand. */}
            {/* Pour une modale de session expirée, le contenu est généralement petit. */}
            {/* Si vous avez du contenu dynamique qui pourrait déborder, le max-h et overflow-y-scroll sont utiles. */}
            <div className="!overflow-y-auto max-h-[450px]">
              {/* Contenu additionnel ici si nécessaire */}
            </div>
            <button
              onClick={handleReconnect}
              className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Se reconnecter
            </button>
          </div>
        </DialogContent>
      </MuiDialog>
    </div>
  );
}
