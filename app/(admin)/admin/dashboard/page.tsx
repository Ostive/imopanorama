"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Dashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const chartData = [
    { month: "Jan", ventes: 12, locations: 2 },
    { month: "Fév", ventes: 19, locations: 3 },
    { month: "Mar", ventes: 3, locations: 20 },
    { month: "Avr", ventes: 5, locations: 5 },
    { month: "Mai", ventes: 2, locations: 1 },
    { month: "Juin", ventes: 3, locations: 4 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="mb-8 text-3xl font-bold text-gray-800">Tableau de bord</h2>

      {/* Stats Overview */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total des ventes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€345,670</div>
            <p className="text-xs text-muted-foreground">
              +20.1% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Locations actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 depuis le mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nouvelles propriétés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12</div>
            <p className="text-xs text-muted-foreground">
              +3 depuis la semaine dernière
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tâches d'entretien
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              5 tâches terminées cette semaine
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Aperçu des ventes et locations</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ventes" fill="#8884d8" />
                <Bar dataKey="locations" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Transactions and Calendar */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dernières transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Propriété</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar className="mr-2">
                        <AvatarImage src="/placeholder-avatar.jpg" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      Jean Dupont
                    </div>
                  </TableCell>
                  <TableCell>Appt 3 pièces, Paris</TableCell>
                  <TableCell>Vente</TableCell>
                  <TableCell>€320,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar className="mr-2">
                        <AvatarImage src="/placeholder-avatar-2.jpg" />
                        <AvatarFallback>ML</AvatarFallback>
                      </Avatar>
                      Marie Leroy
                    </div>
                  </TableCell>
                  <TableCell>Maison, Bordeaux</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>€1,200/mois</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendrier des rendez-vous</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Tasks */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Tâches d'entretien en cours</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="urgent">Urgentes</TabsTrigger>
              <TabsTrigger value="scheduled">Planifiées</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Propriété</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date prévue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Appt 2, Rue de la Paix</TableCell>
                    <TableCell>Réparation fuite d'eau</TableCell>
                    <TableCell>
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">
                        Urgent
                      </span>
                    </TableCell>
                    <TableCell>23/03/2024</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Maison 5, Av. des Champs</TableCell>
                    <TableCell>Peinture façade</TableCell>
                    <TableCell>
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                        Planifié
                      </span>
                    </TableCell>
                    <TableCell>15/04/2024</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
