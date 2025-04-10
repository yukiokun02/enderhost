
import { useState, useEffect, useRef } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Pencil, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface EditableTextProps {
  id: string;
  defaultContent: string;
  isHeading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const EditableText = ({ 
  id, 
  defaultContent, 
  isHeading = false, 
  className = "", 
  children 
}: EditableTextProps) => {
  const { isAdmin, isEditMode, editedContent, updateContent } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(defaultContent);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // If we have saved content for this element, use it
  useEffect(() => {
    if (editedContent[id] !== undefined) {
      setContent(editedContent[id]);
    } else {
      setContent(defaultContent);
    }
  }, [id, defaultContent, editedContent]);

  const handleEdit = () => {
    setIsEditing(true);
    setTimeout(() => {
      editorRef.current?.focus();
    }, 0);
  };

  const handleSave = () => {
    updateContent(id, content);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setContent(editedContent[id] || defaultContent);
    setIsEditing(false);
  };

  // If not in admin edit mode, just render the content
  if (!isAdmin || !isEditMode) {
    return <>{children || content}</>;
  }

  return (
    <div className="group relative">
      {isEditing ? (
        <div className="flex flex-col space-y-2">
          <Textarea
            ref={editorRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] p-2 bg-black/80 border border-minecraft-secondary/50 text-white resize-y"
            rows={content.split('\n').length + 1}
          />
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              className="bg-green-600 hover:bg-green-700" 
              onClick={handleSave}
            >
              <Check className="h-4 w-4 mr-1" /> Save
            </Button>
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={handleCancel}
            >
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Popover>
            <div 
              className={`${className} ${isHeading ? 'cursor-pointer' : ''} border border-transparent hover:border-dashed hover:border-minecraft-secondary/50 p-1 rounded ${isHeading ? 'inline-block' : ''}`}
            >
              {children || content}
            </div>
            <PopoverTrigger asChild>
              <Button 
                size="sm" 
                variant="ghost"
                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 bg-black/70 hover:bg-black/90 text-minecraft-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit();
                }}
              >
                <Pencil className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 bg-black/90 border border-minecraft-secondary/50 text-white p-3">
              <p className="text-xs">Click to edit this content. Your changes will be saved when you click "Save All Changes".</p>
            </PopoverContent>
          </Popover>
        </>
      )}
    </div>
  );
};

export default EditableText;
