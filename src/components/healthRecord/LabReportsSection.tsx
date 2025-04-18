import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Download, 
  Upload, 
  Plus,
  X,
  Search
} from "lucide-react";
import { useState, useEffect } from "react";
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
import { commonLabTests, searchLabTests, LabTestDefinition } from "@/lib/data/lab-tests";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toFhirObservation } from "@/lib/fhir/types";

interface LabReport {
  id: string;
  name: string;
  date: string;
  status: "normal" | "abnormal" | "pending";
  fileUrl?: string;
  testResults?: LabTestResult[];
}

interface LabTestResult {
  id: string;
  testId: string;
  testName: string;
  value: string;
  unit: string;
  referenceRange?: string;
  isAbnormal: boolean;
  loincCode?: string;
}

interface LabReportsSectionProps {
  isEditing: boolean;
}

const LabReportsSection: React.FC<LabReportsSectionProps> = ({ isEditing }) => {
  const { toast } = useToast();
  const [newReport, setNewReport] = useState<Partial<LabReport>>({
    name: "",
    date: new Date().toISOString().split('T')[0],
    status: "normal",
    testResults: []
  });
  
  const [reports, setReports] = useState<LabReport[]>([
    {
      id: "lab1",
      name: "Complete Blood Count (CBC)",
      date: "2025-03-12",
      status: "normal",
      fileUrl: "#",
      testResults: [
        {
          id: "tr1",
          testId: "lab1",
          testName: "Hemoglobin",
          value: "13.5",
          unit: "g/dL",
          referenceRange: "12.0-15.5 g/dL",
          isAbnormal: false,
          loincCode: "718-7"
        },
        {
          id: "tr2",
          testId: "lab2",
          testName: "White Blood Cell Count",
          value: "6.8",
          unit: "x10^9/L",
          referenceRange: "4.5-11.0 x10^9/L",
          isAbnormal: false,
          loincCode: "6690-2"
        }
      ]
    },
    {
      id: "lab2",
      name: "HbA1c",
      date: "2025-01-03",
      status: "abnormal",
      fileUrl: "#",
      testResults: [
        {
          id: "tr3",
          testId: "lab5",
          testName: "Hemoglobin A1c",
          value: "6.8",
          unit: "%",
          referenceRange: "< 5.7%",
          isAbnormal: true,
          loincCode: "4548-4"
        }
      ]
    }
  ]);

  const [newTestResult, setNewTestResult] = useState<Partial<LabTestResult>>({
    value: "",
    isAbnormal: false
  });
  
  const [testSearchQuery, setTestSearchQuery] = useState("");
  const [testSearchResults, setTestSearchResults] = useState<LabTestDefinition[]>([]);
  const [selectedTest, setSelectedTest] = useState<LabTestDefinition | null>(null);
  const [addingTestResult, setAddingTestResult] = useState(false);
  
  const [localIsEditing, setLocalIsEditing] = useState(isEditing);
  
  useEffect(() => {
    setLocalIsEditing(isEditing);
  }, [isEditing]);

  useEffect(() => {
    if (testSearchQuery.length >= 2) {
      const results = searchLabTests(testSearchQuery);
      setTestSearchResults(results);
    } else {
      setTestSearchResults([]);
    }
  }, [testSearchQuery]);

  const handleTestSelect = (test: LabTestDefinition) => {
    setSelectedTest(test);
    setNewTestResult({
      ...newTestResult,
      testId: test.id,
      testName: test.name,
      unit: test.unit,
      referenceRange: test.referenceRange.text || `${test.referenceRange.low || ''}-${test.referenceRange.high || ''} ${test.unit}`,
      loincCode: test.loincCode
    });
    setTestSearchQuery("");
  };
  
  const handleAddTestResult = () => {
    if (!selectedTest || !newTestResult.value) {
      toast({
        title: "Missing information",
        description: "Please select a test and enter a value",
        variant: "destructive"
      });
      return;
    }

    // Check if test result is abnormal based on reference range
    let isAbnormal = false;
    const numValue = parseFloat(newTestResult.value);
    if (!isNaN(numValue)) {
      if (
        (selectedTest.referenceRange.low && numValue < selectedTest.referenceRange.low) ||
        (selectedTest.referenceRange.high && numValue > selectedTest.referenceRange.high)
      ) {
        isAbnormal = true;
      }
    }

    const newResult = {
      id: `tr${Date.now()}`,
      testId: selectedTest.id,
      testName: selectedTest.name,
      value: newTestResult.value,
      unit: selectedTest.unit,
      referenceRange: selectedTest.referenceRange.text || 
        `${selectedTest.referenceRange.low || ''}-${selectedTest.referenceRange.high || ''} ${selectedTest.unit}`,
      isAbnormal,
      loincCode: selectedTest.loincCode
    };

    // Add to current test results list
    setNewReport({
      ...newReport,
      testResults: [...(newReport.testResults || []), newResult],
      status: isAbnormal ? "abnormal" : newReport.status
    });

    // Convert to FHIR format (demonstration)
    const fhirObservation = toFhirObservation(
      {
        id: `tr${Date.now()}`,
        code: {
          coding: [
            {
              system: "http://loinc.org",
              code: selectedTest.loincCode,
              display: selectedTest.name
            }
          ],
          text: selectedTest.name
        },
        valueQuantity: {
          value: parseFloat(newTestResult.value),
          unit: selectedTest.unit,
          system: "http://unitsofmeasure.org",
          code: selectedTest.unit
        },
        referenceRange: [
          {
            low: selectedTest.referenceRange.low ? { value: selectedTest.referenceRange.low, unit: selectedTest.unit } : undefined,
            high: selectedTest.referenceRange.high ? { value: selectedTest.referenceRange.high, unit: selectedTest.unit } : undefined,
            text: selectedTest.referenceRange.text
          }
        ],
        status: "final",
        effectiveDateTime: newReport.date || new Date().toISOString()
      },
      "patient-1" // Mock patient ID
    );
    
    // Log FHIR data (in a real app this would be saved to the database)
    console.log("FHIR Observation:", fhirObservation);

    // Reset form
    setNewTestResult({ value: "", isAbnormal: false });
    setSelectedTest(null);
    setAddingTestResult(false);

    toast({
      title: "Test result added",
      description: `${selectedTest.name} has been added to the lab report`
    });
  };
  
  const handleRemoveTestResult = (id: string) => {
    const updatedResults = newReport.testResults?.filter(result => result.id !== id) || [];
    
    // Update abnormal status if needed
    let updatedStatus: "normal" | "abnormal" | "pending" = "normal";
    if (updatedResults.some(result => result.isAbnormal)) {
      updatedStatus = "abnormal";
    }
    
    setNewReport({
      ...newReport,
      testResults: updatedResults,
      status: updatedResults.length === 0 ? "pending" : updatedStatus
    });
  };
  
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
      fileUrl: newReport.fileUrl,
      testResults: newReport.testResults || []
    };
    
    setReports([...reports, newReportObj]);
    
    setNewReport({
      name: "",
      date: new Date().toISOString().split('T')[0],
      status: "normal",
      testResults: []
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
          <DialogContent className="sm:max-w-[600px]">
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
                  <Select
                    value={newReport.status}
                    onValueChange={(value: "normal" | "abnormal" | "pending") => 
                      setNewReport({ ...newReport, status: value })
                    }
                  >
                    <SelectTrigger id="reportStatus">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="abnormal">Abnormal</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Test Results</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setAddingTestResult(true)}
                    >
                      <Plus size={14} className="mr-1" /> Add Test
                    </Button>
                  </div>
                  
                  {addingTestResult && (
                    <div className="border rounded-md p-3 space-y-3 mb-3">
                      <div className="space-y-2">
                        <Label htmlFor="testSearch">Search Test</Label>
                        <div className="relative">
                          <Input 
                            id="testSearch" 
                            value={testSearchQuery}
                            onChange={(e) => setTestSearchQuery(e.target.value)}
                            placeholder="Start typing to search tests"
                            className="pr-10"
                          />
                          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                        
                        {testSearchResults.length > 0 && testSearchQuery.length >= 2 && (
                          <div className="absolute z-10 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
                            {testSearchResults.map((test) => (
                              <div 
                                key={test.id} 
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleTestSelect(test)}
                              >
                                <div className="font-medium">{test.name}</div>
                                <div className="text-xs text-gray-500">
                                  {test.unit} • {test.referenceRange.text || 
                                    `${test.referenceRange.low || ''}-${test.referenceRange.high || ''} ${test.unit}`}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {selectedTest && (
                          <div className="bg-blue-50 border border-blue-200 rounded-md p-2 text-sm">
                            <p className="font-medium">{selectedTest.name}</p>
                            <p className="text-xs text-gray-600">
                              Unit: {selectedTest.unit} • Reference: {selectedTest.referenceRange.text || 
                                `${selectedTest.referenceRange.low || ''}-${selectedTest.referenceRange.high || ''} ${selectedTest.unit}`}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="testValue">Value</Label>
                          <Input 
                            id="testValue" 
                            value={newTestResult.value}
                            onChange={(e) => setNewTestResult({ ...newTestResult, value: e.target.value })}
                            placeholder={`Enter value (${selectedTest?.unit || ''})`}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 pt-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setAddingTestResult(false);
                            setSelectedTest(null);
                            setNewTestResult({ value: "", isAbnormal: false });
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="button" 
                          size="sm" 
                          onClick={handleAddTestResult}
                          disabled={!selectedTest || !newTestResult.value}
                        >
                          Add Test
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {newReport.testResults && newReport.testResults.length > 0 ? (
                    <div className="border rounded-md p-2">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left border-b">
                            <th className="pb-1">Test</th>
                            <th className="pb-1">Value</th>
                            <th className="pb-1">Status</th>
                            <th className="pb-1"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {newReport.testResults.map((result) => (
                            <tr key={result.id} className="border-b last:border-0">
                              <td className="py-2">{result.testName}</td>
                              <td className="py-2">
                                {result.value} {result.unit}
                              </td>
                              <td className="py-2">
                                {result.isAbnormal ? (
                                  <Badge className="bg-red-100 text-red-800 text-xs">Abnormal</Badge>
                                ) : (
                                  <Badge className="bg-green-100 text-green-800 text-xs">Normal</Badge>
                                )}
                              </td>
                              <td className="py-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 w-6 p-0 text-red-500"
                                  onClick={() => handleRemoveTestResult(result.id)}
                                >
                                  <X size={14} />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No test results added yet</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reportFile">Upload Report Document (Optional)</Label>
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
