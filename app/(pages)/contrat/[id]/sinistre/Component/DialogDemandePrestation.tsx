"use client";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import PrestationStepper from "./PrestationStepper";

export default function DialogPrestation() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="">
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button className="px-6 py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-lg transition-colors duration-300">
            Demander une Prestation
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] md:!max-h-full md:max-w-[70%]">
          <AlertDialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Demande de Prestation
            </DialogTitle>
          </AlertDialogHeader>
          <div className="mt-1/2 !overflow-y-scroll max-h-[450px]">
            <PrestationStepper onClose={() => {}} sinistreId="" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
