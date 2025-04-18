import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface MetricReading {
  id: string;
  date: string;
  value: number;
}

interface MetricData {
  name: string;
  unit: string;
  normalRange?: { min: number; max: number };
  readings: MetricReading[];
}

interface MetricsSectionProps {
  isEditing: boolean;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({ isEditing }) => {
  const { toast } = useToast();
  const [localIsEditing, setLocalIsEditing] = useState(isEditing);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  
  const [metrics, setMetrics] = useState<Record<string, MetricData>>({
    bloodPressure: {
      name: "Blood Pressure",
      unit: "mmHg",
      normalRange: { min: 90, max: 120 },
      readings: [
        { id: "bp1", date: "2025-01-15", value: 120 },
        { id: "bp2", date: "2025-02-10", value: 118 },
        { id: "bp3", date: "2025-03-05", value: 122 }
      ]
    },
    heartRate: {
      name: "Heart Rate",
      unit: "bpm",
      normalRange: { min: 60, max: 100 },
      readings: [
        { id: "hr1", date: "2025-01-15", value: 72 },
        { id: "hr2", date: "2025-02-10", value: 75 },
        { id: "hr3", date: "2025-03-05", value: 70 }
      ]
    },
    glucose: {
      name: "Blood Glucose",
      unit: "mg/dL",
      normalRange: { min: 70, max: 100 },
      readings: [
        { id: "gl1", date: "2025-01-15", value: 95 },
        { id: "gl2", date: "2025-02-10", value: 92 },
        { id: "gl3", date: "2025-03-05", value: 88 }
      ]
    },
    weight: {
      name: "Weight",
      unit: "kg",
      readings: [
        { id: "wt1", date: "2025-01-15", value: 68 },
        { id: "wt2", date: "2025-02-10", value: 67.5 },
        { id: "wt3", date: "2025-03-05", value: 67.8 }
      ]
    }
  });
  
  const [newReading, setNewReading] = useState<{
    metricKey: string;
    date: string;
    value: string;
  }>({
    metricKey: "",
    date: new Date().toISOString().split('T')[0],
    value: ""
  });
  
  useEffect(() => {
    setLocalIsEditing(isEditing);
  }, [isEditing]);
  
  const handleAddReading = () => {
    if (!newReading.metricKey || !newReading.value) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const value = parseFloat(newReading.value);
    if (isNaN(value)) {
      toast({
        title: "Invalid value",
        description: "Please enter a valid number",
        variant: "destructive"
      });
      return;
    }
    
    const metricKey = newReading.metricKey;
    const updatedMetrics = { ...metrics };
    
    updatedMetrics[metricKey].readings.push({
      id: `${metricKey}${Date.now()}`,
      date: newReading.date,
      value: value
    });
    
    // Sort readings by date
    updatedMetrics[metricKey].readings.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    setMetrics(updatedMetrics);
    
    setNewReading({
      metricKey: "",
      date: new Date().toISOString().split('T')[0],
      value: ""
    });
    
    toast({
      title: "Reading added",
      description: `New ${metrics[metricKey].name} reading has been added`
    });
  };
  
  const formatDateForChart = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  const getChartData = (metricKey: string) => {
    const metricData = metrics[metricKey];
    return metricData.readings.map(reading => ({
      date: formatDateForChart(reading.date),
      value: reading.value,
    }));
  };
  
  const getLatestReadingClass = (metricKey: string) => {
    const metric = metrics[metricKey];
    if (!metric.readings.length || !metric.normalRange) return "";
    
    const latestReading = metric.readings[metric.readings.length - 1];
    
    if (latestReading.value < metric.normalRange.min) return "text-blue-600";
    if (latestReading.value > metric.normalRange.max) return "text-red-600";
    return "text-green-600";
  };
  
  const getLatestReading = (metricKey: string) => {
    const metric = metrics[metricKey];
    if (!metric.readings.length) return "No data";
    
    const latestReading = metric.readings[metric.readings.length - 1];
    return `${latestReading.value} ${metric.unit}`;
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900">Health Metrics</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2"
          onClick={() => setLocalIsEditing(true)}
        >
          <Pencil className="w-3 h-3 mr-1" />
          Add Reading
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(metrics).map(([key, metric]) => (
          <div 
            key={key}
            className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">{metric.name}</h4>
              <span className={`font-bold ${getLatestReadingClass(key)}`}>
                {getLatestReading(key)}
              </span>
            </div>
            
            <div className="h-[150px]">
              {metric.readings.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getChartData(key)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#9D5A8F" 
                      strokeWidth={2}
                      dot={{ fill: '#9D5A8F', r: 4 }} 
                    />
                    {metric.normalRange && (
                      <>
                        <Line 
                          type="monotone"
                          dataKey={() => metric.normalRange?.max}
                          stroke="#cccccc"
                          strokeDasharray="3 3"
                          strokeWidth={1}
                          dot={false}
                        />
                        <Line 
                          type="monotone"
                          dataKey={() => metric.normalRange?.min}
                          stroke="#cccccc" 
                          strokeDasharray="3 3"
                          strokeWidth={1}
                          dot={false}
                        />
                      </>
                    )}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-slate-400">No data available</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <Dialog open={localIsEditing} onOpenChange={setLocalIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Health Metric Reading</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metricType">Metric Type</Label>
                <select
                  id="metricType"
                  className="w-full border rounded-md h-10 px-3"
                  value={newReading.metricKey}
                  onChange={(e) => setNewReading({ ...newReading, metricKey: e.target.value })}
                >
                  <option value="">Select metric</option>
                  {Object.entries(metrics).map(([key, metric]) => (
                    <option key={key} value={key}>{metric.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="readingDate">Date</Label>
                <Input 
                  id="readingDate" 
                  type="date"
                  value={newReading.date}
                  onChange={(e) => setNewReading({ ...newReading, date: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="readingValue">Value {newReading.metricKey && `(${metrics[newReading.metricKey].unit})`}</Label>
                <Input 
                  id="readingValue" 
                  type="number"
                  value={newReading.value}
                  onChange={(e) => setNewReading({ ...newReading, value: e.target.value })}
                  placeholder="Enter value"
                  step="any"
                />
                
                {newReading.metricKey && metrics[newReading.metricKey].normalRange && (
                  <p className="text-xs text-slate-500 mt-1">
                    Normal range: {metrics[newReading.metricKey].normalRange?.min} - {metrics[newReading.metricKey].normalRange?.max} {metrics[newReading.metricKey].unit}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4 mt-4">
              <Button type="button" variant="outline" onClick={() => setLocalIsEditing(false)}>
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={handleAddReading}
                disabled={!newReading.metricKey || !newReading.value}
              >
                <Plus size={16} className="mr-1" /> Add Reading
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MetricsSection;
