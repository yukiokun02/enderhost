
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Save, PlusCircle } from "lucide-react";
import { toast } from "sonner";

// Example server types data
const initialServerTypes = [
  {
    id: 1,
    name: "Vanilla",
    description: "The classic Minecraft experience without modifications",
    features: ["Original gameplay", "No mods required", "Latest Minecraft version", "Easy setup"],
    iconUrl: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Forge",
    description: "Run modded Minecraft servers with the popular Forge API",
    features: ["Thousands of mods", "Custom modpacks", "Community support", "Advanced configurations"],
    iconUrl: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Spigot",
    description: "Performance-optimized server with plugin support",
    features: ["Plugin support", "Better performance", "Custom configurations", "Large community"],
    iconUrl: "/placeholder.svg"
  }
];

export default function ServerTypesManagement() {
  const navigate = useNavigate();
  const [serverTypes, setServerTypes] = useState(initialServerTypes);
  const [editingType, setEditingType] = useState<null | {
    id: number;
    name: string;
    description: string;
    features: string[];
    iconUrl: string;
  }>(null);
  const [newFeature, setNewFeature] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const handleEditServerType = (serverType: typeof serverTypes[0]) => {
    setEditingType({...serverType});
  };
  
  const handleAddFeature = () => {
    if (editingType && newFeature.trim()) {
      setEditingType({
        ...editingType,
        features: [...editingType.features, newFeature]
      });
      setNewFeature("");
    }
  };
  
  const handleRemoveFeature = (index: number) => {
    if (editingType) {
      const updatedFeatures = [...editingType.features];
      updatedFeatures.splice(index, 1);
      setEditingType({
        ...editingType,
        features: updatedFeatures
      });
    }
  };
  
  const handleSaveServerType = () => {
    if (editingType) {
      setIsSaving(true);
      
      setTimeout(() => {
        const updatedTypes = serverTypes.map(type => 
          type.id === editingType.id ? editingType : type
        );
        setServerTypes(updatedTypes);
        setEditingType(null);
        setIsSaving(false);
        toast.success("Server type updated successfully!");
      }, 1000);
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
        
        <h1 className="text-3xl font-bold tracking-tight mb-6 text-minecraft-dark">Server Types Management</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {serverTypes.map((serverType) => (
            <Card 
              key={serverType.id} 
              className="border-minecraft-primary/20 hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="bg-minecraft-primary/10 p-2 rounded-md">
                    <img 
                      src={serverType.iconUrl} 
                      alt={serverType.name}
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <CardTitle>{serverType.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{serverType.description}</CardDescription>
                <ul className="space-y-2 mb-4">
                  {serverType.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-minecraft-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => handleEditServerType(serverType)}
                  className="w-full bg-minecraft-primary hover:bg-minecraft-secondary"
                >
                  Edit Server Type
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {editingType && (
          <Card className="border-minecraft-primary/30 mb-8">
            <CardHeader>
              <CardTitle>Edit {editingType.name} Server Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="server-name">Server Type Name</Label>
                <Input 
                  id="server-name"
                  value={editingType.name}
                  onChange={(e) => setEditingType({...editingType, name: e.target.value})}
                  className="border-minecraft-primary/30 focus-visible:ring-minecraft-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="server-description">Description</Label>
                <Textarea 
                  id="server-description"
                  value={editingType.description}
                  onChange={(e) => setEditingType({...editingType, description: e.target.value})}
                  className="border-minecraft-primary/30 focus-visible:ring-minecraft-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="server-icon">Icon URL</Label>
                <Input 
                  id="server-icon"
                  value={editingType.iconUrl}
                  onChange={(e) => setEditingType({...editingType, iconUrl: e.target.value})}
                  className="border-minecraft-primary/30 focus-visible:ring-minecraft-primary"
                />
              </div>
              
              <div>
                <Label>Features</Label>
                <ul className="mt-2 space-y-2">
                  {editingType.features.map((feature, index) => (
                    <li key={index} className="flex justify-between items-center p-2 border border-gray-200 rounded">
                      <span>{feature}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveFeature(index)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <span className="sr-only">Remove</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
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
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button 
                  variant="outline" 
                  className="mr-2 border-minecraft-primary text-minecraft-primary"
                  onClick={() => setEditingType(null)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveServerType}
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
