
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Upload, Trash, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Example image data - in a real application, these would be fetched from a server
const initialImages = [
  { id: 1, name: "hero-banner.jpg", url: "/placeholder.svg", section: "Hero" },
  { id: 2, name: "feature-1.png", url: "/placeholder.svg", section: "Features" },
  { id: 3, name: "server-type-premium.png", url: "/placeholder.svg", section: "Server Types" },
  { id: 4, name: "pricing-bg.jpg", url: "/placeholder.svg", section: "Pricing" },
];

export default function ImageManagement() {
  const navigate = useNavigate();
  const [images, setImages] = useState(initialImages);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<null | { id: number, name: string, url: string, section: string }>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleUpload = () => {
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const newId = Math.max(...images.map(img => img.id)) + 1;
      const newImage = { 
        id: newId, 
        name: `uploaded-image-${newId}.jpg`, 
        url: "/placeholder.svg", 
        section: "New Uploads" 
      };
      
      setImages([...images, newImage]);
      setIsUploading(false);
      toast.success("Image uploaded successfully!");
    }, 1500);
  };
  
  const handleDelete = () => {
    if (selectedImage) {
      setImages(images.filter(img => img.id !== selectedImage.id));
      setIsDeleteDialogOpen(false);
      setSelectedImage(null);
      toast.success("Image deleted successfully!");
    }
  };
  
  const filteredImages = images.filter(image => 
    image.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    image.section.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-minecraft-light to-white p-6">
      <div className="max-w-6xl mx-auto">
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
        
        <h1 className="text-3xl font-bold tracking-tight mb-6 text-minecraft-dark">Image Management</h1>
        
        <div className="flex justify-between items-center mb-6">
          <div className="w-1/2">
            <Input 
              placeholder="Search images..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-minecraft-primary/30 focus-visible:ring-minecraft-primary"
            />
          </div>
          <div>
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept="image/*"
              onChange={handleUpload}
            />
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              className="bg-minecraft-primary hover:bg-minecraft-secondary flex items-center gap-2"
              disabled={isUploading}
            >
              <Upload className="h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload Image"}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image) => (
            <Card key={image.id} className="overflow-hidden border-minecraft-primary/20 hover:shadow-md transition-shadow">
              <div 
                className="h-40 bg-gray-100 cursor-pointer flex items-center justify-center"
                onClick={() => {
                  setSelectedImage(image);
                  setIsViewDialogOpen(true);
                }}
              >
                {image.url ? (
                  <img 
                    src={image.url} 
                    alt={image.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-16 w-16 text-gray-400" />
                )}
              </div>
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <div className="truncate">
                    <p className="font-medium truncate">{image.name}</p>
                    <p className="text-xs text-gray-500">{image.section}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:bg-red-50"
                    onClick={() => {
                      setSelectedImage(image);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
            <p className="mt-2 text-gray-500">No images found</p>
          </div>
        )}
        
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Image</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedImage?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedImage?.name}</DialogTitle>
              <DialogDescription>
                Section: {selectedImage?.section}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center">
              <img 
                src={selectedImage?.url || "/placeholder.svg"} 
                alt={selectedImage?.name} 
                className="max-h-96 object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
