import { Agence } from "@/app/Types/type";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAgenceContext } from "@/hooks/contexts/useAgenceContext";
import { Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";

export default function AgencePage() {
  const { agences } = useAgenceContext();

  const [agence, setAgence] = useState<Agence | null>(null);
  useEffect(() => {
    if (agences && agences.length > 0) {
      setAgence(agences[0]);
    } else {
      setAgence(null);
    }
  }, [agences]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Nos Agences</h1>
        <p className="text-slate-600 mt-1">
          Trouvez l'agence la plus proche de vous
        </p>
      </div>

      <Card className="shadow-lg border-0">
        <CardContent className="p-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 text-center">
            <MapPin className="w-16 h-16 mx-auto text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Carte Interactive
            </h3>
            <p className="text-slate-600 mb-6">
              Explorez nos agences à travers l'Afrique de l'Ouest sur notre
              carte interactive
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Ouvrir la Carte
            </Button>
          </div>
        </CardContent>
      </Card>

      {agence && (
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Agence Principale</CardTitle>
            <CardDescription>{agence.DistrictAgence}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">
                  {agence.DistrictAgence}
                </h3>
                <p className="text-slate-600 mt-1">
                  {agence.LocalisationAgence}
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Phone className="w-4 h-4" />
                    <span>{agence.TelephoneAgence}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Mail className="w-4 h-4" />
                    <span>Email: nsiavie.guinee@groupensia.com</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {agences && agences.length > 1 && (
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Autres Agences</CardTitle>
            <CardDescription>
              Découvrez nos autres agences à travers le Cameroun
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {agences.map((agence) => (
              <div
                key={agence.IdAgence}
                className="p-4 bg-white rounded-lg shadow"
              >
                <h4 className="font-semibold text-slate-900">
                  {agence.DistrictAgence}
                </h4>
                <p className="text-slate-600">{agence.LocalisationAgence}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
