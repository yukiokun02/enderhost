
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Save } from "lucide-react";
import { toast } from "sonner";

// This is a placeholder component. In a real implementation,
// you'd fetch content from a database or API and save changes back.
export default function ContentManagement() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  
  // Example content state - in a real app, this would be loaded from a database
  const [content, setContent] = useState({
    heroHeading: "Minecraft Server Hosting Made Easy",
    heroSubheading: "Experience the best performance with our optimized servers",
    heroDescription: "Our servers are optimized for Minecraft, ensuring smooth gameplay for you and your friends. Start your own Minecraft server today with our easy-to-use control panel.",
    featuresHeading: "Why Choose Our Hosting",
    promoOfferText: "🔥 Limited-Time Opening Offer – 25% OFF! 🔥"
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContent((prevContent) => ({
      ...prevContent,
      [name]: value
    }));
  };
  
  const handleSave = () => {
    setIsSaving(true);
    
    // In a real application, you would save the content to a database or API
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Content updated successfully!");
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight mb-6">Content Management</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>
              Edit the content that appears in the hero section of your homepage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heroHeading">Heading</Label>
              <Input 
                id="heroHeading"
                name="heroHeading"
                value={content.heroHeading}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroSubheading">Subheading</Label>
              <Input 
                id="heroSubheading"
                name="heroSubheading"
                value={content.heroSubheading}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroDescription">Description</Label>
              <Textarea 
                id="heroDescription"
                name="heroDescription"
                value={content.heroDescription}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Features Section</CardTitle>
            <CardDescription>
              Edit the content for the features section
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="featuresHeading">Heading</Label>
              <Input 
                id="featuresHeading"
                name="featuresHeading"
                value={content.featuresHeading}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Promotional Offers</CardTitle>
            <CardDescription>
              Edit promotional offer text
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="promoOfferText">Promo Text</Label>
              <Input 
                id="promoOfferText"
                name="promoOfferText"
                value={content.promoOfferText}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            {isSaving ? "Saving..." : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
