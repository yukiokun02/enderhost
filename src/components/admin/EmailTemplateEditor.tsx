
import { useState, useEffect } from "react";
import { getEmailTemplates, updateEmailTemplate, logUserActivity } from "@/lib/adminAuth";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { 
  Save,
  FileText,
  Mail,
  Eye
} from "lucide-react";

const EmailTemplateEditor = () => {
  const [templates, setTemplates] = useState<Record<string, any>>({});
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [currentTemplate, setCurrentTemplate] = useState<any>(null);
  const [subject, setSubject] = useState("");
  const [htmlBody, setHtmlBody] = useState("");
  const [previewMode, setPreviewMode] = useState<"edit" | "preview">("edit");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    setIsLoading(true);
    const allTemplates = getEmailTemplates();
    setTemplates(allTemplates);
    
    if (Object.keys(allTemplates).length > 0 && !selectedTemplate) {
      // Default to order confirmation template
      const orderTemplateId = "orderConfirmation";
      if (allTemplates[orderTemplateId]) {
        setSelectedTemplate(orderTemplateId);
        setCurrentTemplate(allTemplates[orderTemplateId]);
        setSubject(allTemplates[orderTemplateId].subject);
        setHtmlBody(allTemplates[orderTemplateId].body);
      } else {
        // Fallback to first template if order confirmation doesn't exist
        const firstKey = Object.keys(allTemplates)[0];
        setSelectedTemplate(firstKey);
        setCurrentTemplate(allTemplates[firstKey]);
        setSubject(allTemplates[firstKey].subject);
        setHtmlBody(allTemplates[firstKey].body);
      }
    }
    setIsLoading(false);
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates[templateId];
    setCurrentTemplate(template);
    setSubject(template.subject);
    setHtmlBody(template.body);
    setPreviewMode("edit");
  };

  const handleSave = () => {
    if (!selectedTemplate) return;
    
    setIsLoading(true);
    const success = updateEmailTemplate(selectedTemplate, {
      subject,
      body: htmlBody
    });
    
    if (success) {
      toast({
        title: "Template saved",
        description: "Your changes have been saved and will be used for new emails.",
      });
      logUserActivity(`Updated email template: ${currentTemplate.name}`);
      loadTemplates(); // Refresh templates
    } else {
      toast({
        title: "Error saving template",
        description: "There was a problem saving your changes.",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-black/40 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
        <h2 className="text-lg font-semibold mb-4">Email Template Editor</h2>
        <p className="text-gray-400">
          Edit your email templates to customize communications with your customers.
          Changes will be applied to all new emails immediately after saving.
        </p>
      </div>

      <div className="bg-black/40 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
          {/* Template Selection */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="template-select">Select Template</Label>
              <Select
                value={selectedTemplate}
                onValueChange={handleTemplateChange}
                disabled={isLoading}
              >
                <SelectTrigger id="template-select">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(templates).map(([id, template]: [string, any]) => (
                    <SelectItem key={id} value={id}>
                      <div className="flex items-center">
                        {id === 'orderConfirmation' && <FileText className="mr-2 h-4 w-4" />}
                        {id === 'welcome' && <Mail className="mr-2 h-4 w-4" />}
                        {id === 'passwordReset' && <FileText className="mr-2 h-4 w-4" />}
                        {template.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {currentTemplate && (
              <div className="space-y-2">
                <div>
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input 
                    id="template-name" 
                    value={currentTemplate.name}
                    readOnly
                    disabled
                    className="bg-black/30"
                  />
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">Template Usage:</p>
                  <div className="text-xs text-gray-500">
                    {selectedTemplate === 'orderConfirmation' && (
                      <p>This template is sent to admin when a customer completes an order.</p>
                    )}
                    {selectedTemplate === 'welcome' && (
                      <p>This template is sent to customers when they create an account.</p>
                    )}
                    {selectedTemplate === 'passwordReset' && (
                      <p>This template is sent when a password reset is requested.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Template Editor */}
          <div className="space-y-4">
            {currentTemplate ? (
              <>
                <Tabs value={previewMode} onValueChange={setPreviewMode as any} className="w-full">
                  <TabsList className="bg-black/40 border border-white/10">
                    <TabsTrigger value="edit" className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      Edit
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex items-center">
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="edit" className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="subject" className="flex items-center">
                        Email Subject
                      </Label>
                      <Input 
                        id="subject" 
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Email subject..."
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="html-body" className="flex items-center">
                        Email Body (HTML)
                      </Label>
                      <Textarea
                        id="html-body"
                        value={htmlBody}
                        onChange={(e) => setHtmlBody(e.target.value)}
                        placeholder="<h1>Email content...</h1>"
                        className="font-mono h-80"
                        disabled={isLoading}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        You can use HTML tags to format your email content.
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <Button 
                        onClick={handleSave} 
                        disabled={isLoading}
                        className="flex items-center"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="preview" className="pt-4">
                    <div className="bg-white text-black rounded-md p-4 overflow-auto h-96">
                      <div className="border-b border-gray-200 pb-2 mb-4">
                        <div className="font-bold">Subject: {subject}</div>
                      </div>
                      <div className="email-preview" dangerouslySetInnerHTML={{ __html: htmlBody }} />
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">
                  No template selected. Please choose a template from the list.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateEditor;
