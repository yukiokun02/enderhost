
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, Trash2, Search } from 'lucide-react';
import { logUserActivity } from '@/lib/adminAuth';

interface ContentItem {
  id: string;
  content: string;
}

const ContentEditor = () => {
  const [editedContent, setEditedContent] = useState<ContentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    try {
      const savedContent = localStorage.getItem('enderhost-edited-content');
      if (savedContent) {
        const contentObj = JSON.parse(savedContent);
        const contentArray = Object.entries(contentObj).map(([id, content]) => ({
          id,
          content: content as string
        }));
        setEditedContent(contentArray);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading edited content:", error);
      setLoading(false);
    }
  }, []);
  
  const handleContentChange = (id: string, newContent: string) => {
    setEditedContent(prev => 
      prev.map(item => 
        item.id === id ? { ...item, content: newContent } : item
      )
    );
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this content item?")) {
      setEditedContent(prev => prev.filter(item => item.id !== id));
    }
  };
  
  const saveAllChanges = () => {
    try {
      const contentObj = editedContent.reduce((obj, item) => {
        obj[item.id] = item.content;
        return obj;
      }, {} as Record<string, string>);
      
      localStorage.setItem('enderhost-edited-content', JSON.stringify(contentObj));
      logUserActivity("Updated website content");
      alert("All content changes saved successfully!");
    } catch (error) {
      console.error("Error saving content:", error);
      alert("Error saving changes. Please try again.");
    }
  };
  
  const filteredContent = editedContent.filter(item => 
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center p-10">Loading content...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Website Content Editor</h2>
        <Button 
          className="bg-green-600 hover:bg-green-700" 
          onClick={saveAllChanges}
        >
          <Save className="h-4 w-4 mr-2" /> Save All Changes
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search content by ID or text..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {filteredContent.length === 0 ? (
        <div className="text-center p-6 bg-black/30 rounded-md border border-white/10">
          {searchTerm ? "No content matches your search." : "No content has been edited yet."}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredContent.map(item => (
            <div 
              key={item.id}
              className="p-4 bg-black/30 rounded-md border border-white/10 space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-mono bg-black/70 px-2 py-1 rounded text-minecraft-secondary">
                  {item.id}
                </span>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Textarea 
                value={item.content}
                onChange={(e) => handleContentChange(item.id, e.target.value)}
                className="min-h-[100px] bg-black/60 border border-white/20"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentEditor;
