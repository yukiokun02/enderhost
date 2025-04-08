
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Plus, Save, Trash } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

// Example pricing data - in a real application, this would be fetched from a database
const initialPricingPlans = [
  {
    id: 1,
    name: "Basic",
    price: 4.99,
    description: "Perfect for small servers with friends",
    features: ["1GB RAM", "10 Player Slots", "Basic Support", "Modpack Support"],
    popular: false
  },
  {
    id: 2,
    name: "Standard",
    price: 9.99,
    description: "Great for medium-sized communities",
    features: ["2GB RAM", "20 Player Slots", "24/7 Support", "Modpack Support", "Daily Backups"],
    popular: true
  },
  {
    id: 3,
    name: "Premium",
    price: 19.99,
    description: "For large communities with high traffic",
    features: ["4GB RAM", "Unlimited Player Slots", "Priority Support", "Modpack Support", "Daily Backups", "DDoS Protection"],
    popular: false
  }
];

export default function PricingManagement() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState(initialPricingPlans);
  const [editingPlan, setEditingPlan] = useState<null | {
    id: number;
    name: string;
    price: number;
    description: string;
    features: string[];
    popular: boolean;
  }>(null);
  const [newFeature, setNewFeature] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const handleEditPlan = (plan: typeof plans[0]) => {
    setEditingPlan({...plan});
  };
  
  const handleSavePlan = () => {
    if (editingPlan) {
      setIsSaving(true);
      
      // Simulate saving delay
      setTimeout(() => {
        const updatedPlans = plans.map(plan => 
          plan.id === editingPlan.id ? editingPlan : plan
        );
        setPlans(updatedPlans);
        setEditingPlan(null);
        setIsSaving(false);
        toast.success("Plan updated successfully!");
      }, 1000);
    }
  };
  
  const handleAddFeature = () => {
    if (editingPlan && newFeature.trim()) {
      setEditingPlan({
        ...editingPlan,
        features: [...editingPlan.features, newFeature]
      });
      setNewFeature("");
    }
  };
  
  const handleRemoveFeature = (index: number) => {
    if (editingPlan) {
      const updatedFeatures = [...editingPlan.features];
      updatedFeatures.splice(index, 1);
      setEditingPlan({
        ...editingPlan,
        features: updatedFeatures
      });
    }
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
        
        <h1 className="text-3xl font-bold tracking-tight mb-6 text-minecraft-dark">Pricing Management</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`border ${plan.popular ? 'border-minecraft-primary' : 'border-gray-200'} hover:shadow-md transition-shadow`}
            >
              <CardHeader className={`${plan.popular ? 'bg-minecraft-primary/10' : 'bg-gray-50'} pb-2`}>
                <CardTitle>
                  {plan.name}
                  {plan.popular && <span className="ml-2 text-xs bg-minecraft-primary text-white px-2 py-1 rounded-full">Popular</span>}
                </CardTitle>
                <div className="text-2xl font-bold">${plan.price.toFixed(2)}<span className="text-sm text-gray-500">/month</span></div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-minecraft-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => handleEditPlan(plan)}
                  className="w-full bg-minecraft-primary hover:bg-minecraft-secondary"
                >
                  Edit Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {editingPlan && (
          <Card className="border-minecraft-primary/30 mb-8">
            <CardHeader>
              <CardTitle>Edit {editingPlan.name} Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="plan-name">Plan Name</Label>
                <Input 
                  id="plan-name"
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({...editingPlan, name: e.target.value})}
                  className="border-minecraft-primary/30 focus-visible:ring-minecraft-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="plan-price">Price ($/month)</Label>
                <Input 
                  id="plan-price"
                  type="number"
                  step="0.01"
                  value={editingPlan.price}
                  onChange={(e) => setEditingPlan({...editingPlan, price: parseFloat(e.target.value)})}
                  className="border-minecraft-primary/30 focus-visible:ring-minecraft-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="plan-description">Description</Label>
                <Textarea 
                  id="plan-description"
                  value={editingPlan.description}
                  onChange={(e) => setEditingPlan({...editingPlan, description: e.target.value})}
                  className="border-minecraft-primary/30 focus-visible:ring-minecraft-primary"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={editingPlan.popular}
                  onCheckedChange={(checked) => setEditingPlan({...editingPlan, popular: checked})}
                  className="data-[state=checked]:bg-minecraft-primary"
                />
                <Label htmlFor="popular-plan">Mark as popular</Label>
              </div>
              
              <div>
                <Label>Features</Label>
                <ul className="mt-2 space-y-2">
                  {editingPlan.features.map((feature, index) => (
                    <li key={index} className="flex justify-between items-center p-2 border border-gray-200 rounded">
                      <span>{feature}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveFeature(index)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex gap-2">
                <Input 
                  placeholder="Add new feature"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  className="border-minecraft-primary/30 focus-visible:ring-minecraft-primary"
                />
                <Button 
                  onClick={handleAddFeature}
                  className="bg-minecraft-primary hover:bg-minecraft-secondary"
                  disabled={!newFeature.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button 
                  variant="outline" 
                  className="mr-2 border-minecraft-primary text-minecraft-primary"
                  onClick={() => setEditingPlan(null)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSavePlan}
                  className="bg-minecraft-primary hover:bg-minecraft-secondary flex items-center gap-2"
                  disabled={isSaving}
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
