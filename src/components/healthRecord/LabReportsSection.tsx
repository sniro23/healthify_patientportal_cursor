
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Download, 
  Upload, 
  ExternalLink, 
  Plus,
  X
} from "lucide-react";
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface LabReport {
  id: string;
  name: string;
  date: string;
  status: "normal" | "abnormal" | "pending";
  fileUrl?: string;
}

const LabReportsSection = () => {
  const { toast } = useToast();
  const [newReport, setNewReport] = useState<Partial<LabReport>>({
    name: "",
    date: new Date().toISOString().split('T')[0],
    status: "normal"
  });
  
  const [reports, setReports] = useState<LabReport[]>([
    {
      id: "lab1",
      name: "Complete Blood Count (CBC)",
      date: "2025-03-12",
      status: "normal",
      fileUrl: "#"
    },
    {
      id: "lab2",
      name: "HbA1c",
      date: "2025-01-03",
      status: "abnormal",
      fileUrl: "#"
    }
  ]);
  
  const handleAddReport = () => {
    if (!newReport.name) {
      toast({
        title: "Missing information",
        description: "Please enter a report name",
        variant: "destructive"
      });
      return;
    }
    
    const newReportObj = {
      id: `lab${Date.now()}`,
      name: newReport.name,
      date: newReport.date || new Date().toISOString().split('T')[0],
      status: newReport.status || "pending",
      fileUrl: newReport.fileUrl
    };
    
    setReports([...reports, newReportObj]);
    
    setNewReport({
      name: "",
      date: new Date().toISOString().split('T')[0],
      status: "normal"
    });
    
    toast({
      title: "Lab report added",
      description: `${newReportObj.name} has been added to your lab reports`
    });
  };
  
  const handleDeleteReport = (id: string) => {
    setReports(reports.filter(report => report.id !== id));
    
    toast({
      title: "Lab report removed",
      description: "The lab report has been removed from your records"
    });
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Simulate file upload
    setTimeout(() => {
      setNewReport({
        ...newReport,
        fileUrl: URL.createObjectURL(file)
      });
      
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully`
      });
    }, 500);
  };
  
  const handleDownloadReport = (report: LabReport) => {
    toast({
      title: "Downloading report",
      description: `${report.name} is being downloaded`
    });
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "normal":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Normal</Badge>;
      case "abnormal":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Abnormal</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900">Lab Reports</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <Upload className="w-3 h-3 mr-1" />
              Upload
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Lab Report</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reportName">Report Name</Label>
                  <Input 
                    id="reportName" 
                    value={newReport.name}
                    onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                    placeholder="e.g. Complete Blood Count"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reportDate">Test Date</Label>
                  <Input 
                    id="reportDate" 
                    type="date"
                    value={newReport.date}
                    onChange={(e) => setNewReport({ ...newReport, date: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reportStatus">Result Status</Label>
                  <select
                    id="reportStatus"
                    className="w-full border rounded-md h-10 px-3"
                    value={newReport.status}
                    onChange={(e) => setNewReport({ 
                      ...newReport, 
                      status: e.target.value as "normal" | "abnormal" | "pending" 
                    })}
                  >
                    <option value="normal">Normal</option>
                    <option value="abnormal">Abnormal</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reportFile">Upload Report (PDF/Image)</Label>
                  <div className="mt-1">
                    <Input 
                      id="reportFile" 
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>
                  <p className="text-xs text-slate-500">Max file size: 5MB</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4 mt-4">
                <Button 
                  type="button" 
                  onClick={handleAddReport}
                  disabled={!newReport.name}
                >
                  <Plus size={16} className="mr-1" /> Add Report
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {reports.length > 0 ? (
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center">
                <div className="bg-slate-100 p-2 rounded-full mr-3">
                  <FileText className="w-4 h-4 text-health-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{report.name}</p>
                  <p className="text-xs text-slate-500">{formatDate(report.date)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {getStatusBadge(report.status)}
                
                {report.fileUrl && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleDownloadReport(report)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteReport(report.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 border rounded-lg">
          <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
          <p className="text-slate-500">No lab reports available</p>
          <p className="text-xs text-slate-400 mt-1">Upload your lab reports to keep track of your test results</p>
        </div>
      )}
    </div>
  );
};

export default LabReportsSection;
