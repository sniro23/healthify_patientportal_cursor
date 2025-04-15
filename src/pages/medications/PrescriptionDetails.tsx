
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { FileText, Download, Calendar, Clock, User, AlarmClock, FileSignature } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

interface Prescription {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  doctorName: string;
  date: Date;
  expiryDate?: Date;
  refillStatus?: string;
}

// Mock prescription data
const MOCK_PRESCRIPTIONS: Record<string, Prescription> = {
  "presc1": {
    id: "presc1",
    medicationName: "Paracetamol",
    dosage: "500mg",
    frequency: "Three times daily",
    duration: "5 days",
    instructions: "Take after meals",
    doctorName: "Dr. Silva",
    date: new Date(2025, 2, 15),
    refillStatus: "No refills remaining",
  },
  "presc2": {
    id: "presc2",
    medicationName: "Amoxicillin",
    dosage: "500mg",
    frequency: "Three times daily",
    duration: "7 days",
    instructions: "Take with food",
    doctorName: "Dr. Ravi",
    date: new Date(2025, 2, 10),
    expiryDate: new Date(2025, 2, 17),
  },
};

const PrescriptionDetails = () => {
  const { prescriptionId } = useParams<{ prescriptionId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // In a real app, we would fetch this from the API
  const prescription = prescriptionId ? MOCK_PRESCRIPTIONS[prescriptionId] : null;

  const handleDownload = () => {
    toast({
      title: "Downloading prescription",
      description: "Your prescription PDF is being prepared...",
    });
  };

  if (!prescription) {
    return (
      <PageContainer title="Prescription Details" showBackButton={true}>
        <div className="text-center py-8 text-slate-500">
          <FileText size={40} className="mx-auto mb-3 text-slate-400" />
          <p>Prescription not found</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/medications")}>
            Back to Medications
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Prescription Details" showBackButton={true}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Prescription Details</h1>
        <p className="text-slate-600 mt-1">
          Full details of your prescription
        </p>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-health-primary">{prescription.medicationName}</h2>
          <Button variant="outline" onClick={handleDownload} className="flex items-center">
            <Download size={16} className="mr-2" />
            Download PDF
          </Button>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-slate-100 p-2 rounded mr-3">
                <AlarmClock size={20} className="text-health-primary" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Dosage</p>
                <p className="font-medium">{prescription.dosage}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-slate-100 p-2 rounded mr-3">
                <Clock size={20} className="text-health-primary" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Frequency</p>
                <p className="font-medium">{prescription.frequency}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-slate-100 p-2 rounded mr-3">
                <Calendar size={20} className="text-health-primary" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Duration</p>
                <p className="font-medium">{prescription.duration}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-slate-100 p-2 rounded mr-3">
                <User size={20} className="text-health-primary" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Prescribing Doctor</p>
                <p className="font-medium">{prescription.doctorName}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-slate-100 p-2 rounded mr-3">
                <Calendar size={20} className="text-health-primary" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Prescription Date</p>
                <p className="font-medium">{format(prescription.date, "PPP")}</p>
              </div>
            </div>

            {prescription.expiryDate && (
              <div className="flex items-start">
                <div className="bg-slate-100 p-2 rounded mr-3">
                  <Calendar size={20} className="text-health-primary" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Expiry Date</p>
                  <p className="font-medium">{format(prescription.expiryDate, "PPP")}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator className="my-4" />

        <div>
          <p className="text-sm text-slate-500 mb-1">Instructions</p>
          <p className="bg-slate-50 p-3 rounded">{prescription.instructions}</p>
        </div>

        {prescription.refillStatus && (
          <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded flex items-center">
            <FileSignature size={20} className="mr-2" />
            <p>Refill Status: {prescription.refillStatus}</p>
          </div>
        )}
      </Card>
    </PageContainer>
  );
};

export default PrescriptionDetails;
