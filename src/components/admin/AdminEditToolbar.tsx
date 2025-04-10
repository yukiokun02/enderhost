
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Pencil, Save, X } from 'lucide-react';

const AdminEditToolbar = () => {
  const { isAdmin, isEditMode, toggleEditMode, saveChanges } = useAdmin();

  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex space-x-2">
      {isEditMode ? (
        <>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={saveChanges}
          >
            <Save className="h-4 w-4 mr-1" /> Save All Changes
          </Button>
          <Button 
            variant="destructive"
            onClick={toggleEditMode}
          >
            <X className="h-4 w-4 mr-1" /> Exit Edit Mode
          </Button>
        </>
      ) : (
        <Button 
          className="bg-minecraft-secondary hover:bg-minecraft-secondary/80"
          onClick={toggleEditMode}
        >
          <Pencil className="h-4 w-4 mr-1" /> Edit Website
        </Button>
      )}
    </div>
  );
};

export default AdminEditToolbar;
