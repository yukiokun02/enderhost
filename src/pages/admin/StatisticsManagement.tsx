
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Save, BarChart2 } from "lucide-react";
import { toast } from "sonner";

// Example statistics data
const initialStats = [
  { id: 1, label: "Active Servers", value: "1,500+", description: "Servers currently running on our platform" },
  { id: 2, label: "Total Players", value: "25,000+", description: "Players that have joined servers hosted on our platform" },
  { id: 3, label: "Uptime", value: "99.9%", description: "Our server uptime guarantee" },
  { id: 4, label: "Years of Service", value: "5+", description: "Years we have been providing Minecraft hosting services" }
];

export default function StatisticsManagement() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(initialStats);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    label: "",
    value: "",
    description: ""
  });
  const [isSaving, setIsSaving] = useState(false);
  
  const handleEditStat = (stat: typeof stats[0]) => {
    setEditingId(stat.id);
    setEditForm({
      label: stat.label,
      value: stat.value,
      description: stat.description
    });
  };
  
  const handleSave = () => {
    if (editingId) {
      setIsSaving(true);
      
      setTimeout(() => {
        const updatedStats = stats.map(stat => 
          stat.id === editingId ? { ...stat, ...editForm } : stat
        );
        setStats(updatedStats);
        setEditingId(null);
        setIsSaving(false);
        toast.success("Statistic updated successfully!");
      }, 1000);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-minecraft-light to-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/admin/dashboard")}
            className="text-minecraft-primary hover:bg-minecraft-primary/10"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight mb-6 text-minecraft-dark">Statistics Management</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {stats.map((stat) => (
            <Card 
              key={stat.id} 
              className={`border ${editingId === stat.id ? 'border-minecraft-primary' : 'border-gray-200'} hover:shadow-md transition-shadow`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{stat.label}</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditStat(stat)}
                    className="text-minecraft-primary hover:bg-minecraft-primary/10"
                  >
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-minecraft-primary mb-1">{stat.value}</div>
                <p className="text-gray-500 text-sm">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {editingId && (
          <Card className="border-minecraft-primary/30 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-minecraft-primary" />
                Edit Statistic
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="label">Statistic Label</Label>
                <Input 
                  id="label"
                  name="label"
                  value={editForm.label}
                  onChange={handleChange}
                  className="border-minecraft-primary/30 focus-visible:ring-minecraft-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="value">Statistic Value</Label>
                <Input 
                  id="value"
                  name="value"
                  value={editForm.value}
                  onChange={handleChange}
                  className="border-minecraft-primary/30 focus-visible:ring-minecraft-primary"
                />
                <p className="text-xs text-gray-500">
                  Use formats like "1,500+", "99.9%", etc. for better presentation
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description"
                  name="description"
                  value={editForm.description}
                  onChange={handleChange}
                  className="border-minecraft-primary/30 focus-visible:ring-minecraft-primary"
                />
              </div>
              
              <div className="flex justify-end pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setEditingId(null)}
                  className="mr-2 border-minecraft-primary text-minecraft-primary"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-minecraft-primary hover:bg-minecraft-secondary flex items-center gap-2"
                >
                  {isSaving ? "Saving..." : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
