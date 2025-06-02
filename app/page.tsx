"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, FileText, MapPin, User, TrendingUp, Calendar, Shield, Phone, Mail, Settings } from "lucide-react"

export default function ModernDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const contracts = [
    {
      id: "31005118",
      product: "NSIA ETUDES",
      status: "Arrêté",
      startDate: "01/05/2021",
      endDate: "01/05/2037",
      premium: "Mensuelle",
    },
    {
      id: "31004321",
      product: "NSIA ETUDES",
      status: "Arrêté",
      startDate: "01/01/2018",
      endDate: "01/01/2035",
      premium: "Mensuelle",
    },
    {
      id: "31004322",
      product: "NSIA ETUDES",
      status: "Arrêté",
      startDate: "01/01/2018",
      endDate: "01/01/2030",
      premium: "Mensuelle",
    },
    {
      id: "31004323",
      product: "NSIA ETUDES",
      status: "Arrêté",
      startDate: "01/01/2018",
      endDate: "01/01/2034",
      premium: "Mensuelle",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  NSIA Assurance
                </span>
              </div>

              <nav className="hidden md:flex space-x-6">
                {[
                  { id: "dashboard", label: "Accueil", icon: TrendingUp },
                  { id: "contracts", label: "Mes Contrats", icon: FileText },
                  { id: "profile", label: "Mon Profil", icon: User },
                  { id: "agencies", label: "Nos Agences", icon: MapPin },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      activeTab === item.id
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>

              <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm">
                    DB
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-slate-900">Diane Bangaly</p>
                  <p className="text-xs text-slate-500">Logisticien</p>
                </div>
                <Button variant="ghost" size="icon">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-slate-900">
                Bienvenue,{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Diane
                </span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Gérez vos contrats d'assurance, consultez vos informations et restez connecté avec nos services.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Contrats Actifs</CardTitle>
                  <FileText className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-900">4</div>
                  <p className="text-xs text-blue-600 mt-1">Tous vos contrats sont à jour</p>
                  <div className="mt-3">
                    <Button variant="ghost" size="sm" className="text-blue-700 hover:bg-blue-200 p-0">
                      Voir les détails →
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Agences Disponibles</CardTitle>
                  <MapPin className="h-6 w-6 text-green-600 group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-900">1</div>
                  <p className="text-xs text-green-600 mt-1">Agence la plus proche</p>
                  <div className="mt-3">
                    <Button variant="ghost" size="sm" className="text-green-700 hover:bg-green-200 p-0">
                      Localiser →
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-700">Profil Complété</CardTitle>
                  <User className="h-6 w-6 text-purple-600 group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-900">65%</div>
                  <Progress value={65} className="mt-2 h-2" />
                  <div className="mt-3">
                    <Button variant="ghost" size="sm" className="text-purple-700 hover:bg-purple-200 p-0">
                      Compléter →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Contracts */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-slate-900">Contrats Récents</CardTitle>
                    <CardDescription className="text-slate-600">Vos derniers contrats d'assurance</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    Voir tout
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {contracts.slice(0, 2).map((contract, index) => (
                    <div key={contract.id} className="p-6 hover:bg-slate-50 transition-colors cursor-pointer group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {contract.product}
                            </h3>
                            <p className="text-sm text-slate-500">Contrat #{contract.id}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                            {contract.status}
                          </Badge>
                          <p className="text-sm text-slate-500 mt-1">Expire: {contract.endDate}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900">Actions Rapides</CardTitle>
                <CardDescription>Accédez rapidement aux fonctionnalités principales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: FileText, label: "Nouvelle Demande", color: "blue" },
                    { icon: Calendar, label: "Rendez-vous", color: "green" },
                    { icon: Phone, label: "Contact Support", color: "purple" },
                    { icon: Mail, label: "Messages", color: "orange" },
                  ].map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-20 flex-col space-y-2 hover:shadow-md transition-all duration-200 group"
                    >
                      <action.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "contracts" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Mes Contrats</h1>
                <p className="text-slate-600 mt-1">Gérez tous vos contrats d'assurance</p>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Nouveau Contrat
              </Button>
            </div>

            <Card className="shadow-lg border-0">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                      <tr>
                        <th className="text-left p-4 font-semibold text-slate-700">Produit</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Numéro</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Début</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Fin</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Périodicité</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {contracts.map((contract) => (
                        <tr key={contract.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                <FileText className="w-4 h-4 text-white" />
                              </div>
                              <span className="font-medium text-slate-900">{contract.product}</span>
                            </div>
                          </td>
                          <td className="p-4 text-slate-600">{contract.id}</td>
                          <td className="p-4 text-slate-600">{contract.startDate}</td>
                          <td className="p-4 text-slate-600">{contract.endDate}</td>
                          <td className="p-4 text-slate-600">{contract.premium}</td>
                          <td className="p-4">
                            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                              {contract.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Mon Profil</h1>
              <p className="text-slate-600 mt-1">Gérez vos informations personnelles</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="shadow-lg border-0">
                <CardHeader className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-2xl">
                      DB
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>Diane Bangaly</CardTitle>
                  <CardDescription>Logisticien</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Modifier Photo
                  </Button>
                  <Button variant="outline" className="w-full">
                    Changer Mot de Passe
                  </Button>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Informations Personnelles</CardTitle>
                  <CardDescription>Mettez à jour vos informations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Nom</label>
                      <div className="p-3 bg-slate-50 rounded-lg border">
                        <span className="text-slate-600">Bangaly</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Prénoms</label>
                      <div className="p-3 bg-slate-50 rounded-lg border">
                        <span className="text-slate-600">Diane</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Date de Naissance</label>
                      <div className="p-3 bg-slate-50 rounded-lg border">
                        <span className="text-slate-600">Non renseigné</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Lieu de Naissance</label>
                      <div className="p-3 bg-slate-50 rounded-lg border">
                        <span className="text-slate-600">Non renseigné</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Téléphone (1)</label>
                      <div className="p-3 bg-slate-50 rounded-lg border">
                        <span className="text-slate-600">+224627103939</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Téléphone (2)</label>
                      <div className="p-3 bg-slate-50 rounded-lg border">
                        <span className="text-slate-600">+224664274247</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Modifier
                    </Button>
                    <Button variant="outline">Appliquer</Button>
                    <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      Annuler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "agencies" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Nos Agences</h1>
              <p className="text-slate-600 mt-1">Trouvez l'agence la plus proche de vous</p>
            </div>

            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 text-center">
                  <MapPin className="w-16 h-16 mx-auto text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Carte Interactive</h3>
                  <p className="text-slate-600 mb-6">
                    Explorez nos agences à travers l'Afrique de l'Ouest sur notre carte interactive
                  </p>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Ouvrir la Carte
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Agence Principale</CardTitle>
                <CardDescription>Immeuble NSIA</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">Immeuble NSIA</h3>
                    <p className="text-slate-600 mt-1">Agence principale pour vos besoins d'assurance</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <Phone className="w-4 h-4" />
                        <span>Tél: (+224) 629 00 00 20 / (+224) 669 00 00 26</span>
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
          </div>
        )}
      </main>
    </div>
  )
}
