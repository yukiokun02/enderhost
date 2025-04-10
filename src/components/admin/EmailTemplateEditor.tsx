
import { useState, useEffect } from "react";
import { logUserActivity } from "@/lib/adminAuth";
import { 
  Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { 
  Save,
  FileText,
  Eye
} from "lucide-react";

const EmailTemplateEditor = () => {
  const [subject, setSubject] = useState("");
  const [htmlBody, setHtmlBody] = useState("");
  const [previewMode, setPreviewMode] = useState<"edit" | "preview">("edit");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadEmailTemplate();
  }, []);

  const loadEmailTemplate = async () => {
    setIsLoading(true);
    try {
      // Fetch the email template directly from the PHP script
      const response = await fetch('/api/manage-email-template.php?action=get_template');
      if (!response.ok) {
        throw new Error('Failed to load template');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSubject(data.subject || "New Minecraft Server Order - {{server_name}}");
        setHtmlBody(data.body || "");
      } else {
        toast({
          title: "Error loading template",
          description: data.message || "Could not load the email template",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error loading email template:", error);
      toast({
        title: "Error loading template",
        description: "There was a problem loading the email template. Please try again.",
        variant: "destructive"
      });
      
      // Fallback to default template values
      setSubject("New Minecraft Server Order - {{server_name}}");
      setHtmlBody(`
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #000; color: #fff; padding: 15px; text-align: center; }
        .header h1 { margin: 0; color: #fff; }
        .header h1 span { color: #00C853; }
        .content { padding: 20px; border: 1px solid #ddd; border-top: none; }
        .order-details { background-color: #f9f9f9; padding: 15px; margin-bottom: 20px; }
        .footer { font-size: 12px; text-align: center; margin-top: 30px; color: #777; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f2f2f2; }
        .credentials { background-color: #f5f5f5; border-left: 4px solid #00C853; padding: 10px; margin: 15px 0; }
        .discount { background-color: #e8f5e9; border-left: 4px solid #00C853; padding: 5px 10px; margin: 5px 0; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Ender<span>HOST</span> - New Order</h1>
        </div>
        <div class='content'>
            <h2>New Minecraft Server Order Received</h2>
            <p>A new server order has been placed. The customer has been directed to the payment page.</p>
            
            <div class='order-details'>
                <h3>Order Details:</h3>
                <table>
                    <tr>
                        <th>Order ID:</th>
                        <td>{{order_id}}</td>
                    </tr>
                    <tr>
                        <th>Server Name:</th>
                        <td>{{server_name}}</td>
                    </tr>
                    <tr>
                        <th>Plan:</th>
                        <td>{{plan}}</td>
                    </tr>
                    <tr>
                        <th>Billing Cycle:</th>
                        <td>{{billing_cycle_text}}</td>
                    </tr>
                    <tr>
                        <th>Total Price:</th>
                        <td>₹{{total_price}}</td>
                    </tr>
                </table>
            </div>
            
            <h3>Customer Information:</h3>
            <table>
                <tr>
                    <th>Name:</th>
                    <td>{{customer_name}}</td>
                </tr>
                <tr>
                    <th>Email:</th>
                    <td>{{customer_email}}</td>
                </tr>
            </table>
        </div>
        <div class='footer'>
            <p>This is an automated message from the EnderHOST ordering system.</p>
            <p>&copy; 2025 EnderHOST. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
      `);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!htmlBody) return;
    
    setIsLoading(true);
    try {
      // Save the template directly to the PHP file
      const response = await fetch('/api/manage-email-template.php?action=update_template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          body: htmlBody
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save template');
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Template saved",
          description: "Your changes have been saved to the email template file.",
        });
        logUserActivity("Updated order confirmation email template");
      } else {
        toast({
          title: "Error saving template",
          description: data.message || "Could not save the email template",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error saving email template:", error);
      toast({
        title: "Error saving template",
        description: "There was a problem saving the email template. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-black/40 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
        <h2 className="text-lg font-semibold mb-4">Email Template Editor</h2>
        <p className="text-gray-400">
          Edit your order confirmation email template to customize communications with your customers.
          Changes will be applied to all new emails immediately after saving.
        </p>
      </div>

      <div className="bg-black/40 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
          {/* Template Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-medium mb-2">Order Confirmation Email</h3>
              <p className="text-sm text-gray-400">
                This template is sent to admin when a customer completes an order.
              </p>
            </div>
            
            <div className="space-y-2 mt-4">
              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-2">Template Usage:</p>
                <div className="text-xs text-gray-500">
                  <p>This template is used in send-order-email.php</p>
                  <p className="mt-2">Available variables:</p>
                  <ul className="list-disc pl-4 mt-1 space-y-1">
                    <li>{"{{order_id}}"}</li>
                    <li>{"{{server_name}}"}</li>
                    <li>{"{{plan}}"}</li>
                    <li>{"{{billing_cycle_text}}"}</li>
                    <li>{"{{total_price}}"}</li>
                    <li>{"{{customer_name}}"}</li>
                    <li>{"{{customer_email}}"}</li>
                    <li>{"{{customer_phone}}"}</li>
                    <li>{"{{discord_username}}"}</li>
                    <li>{"{{customer_password}}"}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Template Editor */}
          <div className="space-y-4">
            <Tabs value={previewMode} onValueChange={(value: "edit" | "preview") => setPreviewMode(value)} className="w-full">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateEditor;
