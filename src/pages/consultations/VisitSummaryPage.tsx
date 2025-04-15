
import React from "react";
import { useParams } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Download, Calendar, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

const VisitSummaryPage = () => {
  const { summaryId } = useParams<{ summaryId: string }>();
  
  // Mock data - would be fetched from API in production
  const visitSummary = {
    id: summaryId,
    date: "2025-03-15T10:30:00Z",
    provider: {
      name: "Dr. Silva",
      specialty: "General Physician"
    },
    complaint: "Fever + Fatigue",
    diagnosis: "Viral Fever",
    medications: [
      {
        name: "Paracetamol",
        dosage: "500mg",
        frequency: "TID",
        duration: "5 days"
      }
    ],
    plan: "Rest, Hydration, Recheck if worsens",
    notes: "Patient reported onset of symptoms 24 hours prior to consultation. No travel history or known exposures.",
    attachments: ["lab_results.pdf"]
  };
  
  return (
    <PageContainer 
      title="Visit Summary" 
      showBackButton={true}
    >
      <div className="space-y-6">
        <header>
          <h1 className="text-xl font-semibold">
            Visit Summary - {formatDate(new Date(visitSummary.date))}
          </h1>
        </header>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-medium text-muted-foreground">Provider</h2>
                <p>{visitSummary.provider.name} - {visitSummary.provider.specialty}</p>
              </div>
              
              <div>
                <h2 className="text-sm font-medium text-muted-foreground">Chief Complaint</h2>
                <p>{visitSummary.complaint}</p>
              </div>
              
              <div>
                <h2 className="text-sm font-medium text-muted-foreground">Diagnosis</h2>
                <p>{visitSummary.diagnosis}</p>
              </div>
              
              <div>
                <h2 className="text-sm font-medium text-muted-foreground">Medications</h2>
                <ul className="list-disc pl-5">
                  {visitSummary.medications.map((med, index) => (
                    <li key={index}>
                      {med.name} {med.dosage} {med.frequency} for {med.duration}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h2 className="text-sm font-medium text-muted-foreground">Treatment Plan</h2>
                <p>{visitSummary.plan}</p>
              </div>
              
              <div>
                <h2 className="text-sm font-medium text-muted-foreground">Additional Notes</h2>
                <p>{visitSummary.notes}</p>
              </div>
              
              {visitSummary.attachments && visitSummary.attachments.length > 0 && (
                <div>
                  <h2 className="text-sm font-medium text-muted-foreground">Attachments</h2>
                  {visitSummary.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center mt-2">
                      <FileText className="h-5 w-5 mr-2 text-gray-500" />
                      <span className="text-sm">{attachment}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1 flex justify-center" variant="outline">
            <Download className="mr-2 h-5 w-5" />
            Download PDF
          </Button>
          <Button className="flex-1 flex justify-center">
            <Calendar className="mr-2 h-5 w-5" />
            Book Follow-up
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default VisitSummaryPage;
