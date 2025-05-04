
import { useState } from "react";
import { useTheme, fontOptions, FontOption } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, RefreshCw, Paintbrush, Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

const FontManagement = () => {
  const { toast } = useToast();
  const { fontFamily, setFontFamily, availableFonts } = useTheme();
  const [previewFont, setPreviewFont] = useState<string>(fontFamily);

  const handleFontChange = (font: string) => {
    setPreviewFont(font);
  };

  const applyFont = (font: string) => {
    setFontFamily(font);
    toast({
      title: "Font Changed",
      description: `The site font has been updated to ${getFontLabelByValue(font)}`,
    });
  };

  const resetPreview = () => {
    setPreviewFont(fontFamily);
    toast({
      title: "Preview Reset",
      description: "Font preview reset to current site font",
    });
  };

  const getFontLabelByValue = (value: string): string => {
    const font = fontOptions.find(f => f.value === value);
    return font ? font.label : value;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 md:flex-row">
        <Card className="flex-1 bg-black/40 border-white/10 text-white">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">Font Management</CardTitle>
                <CardDescription className="text-gray-400">
                  Change the font style used across the site
                </CardDescription>
              </div>
              <Paintbrush className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-blue-900/20 border-blue-500/30 text-blue-200">
              <Info className="h-4 w-4" />
              <AlertTitle>Font Preview</AlertTitle>
              <AlertDescription className="text-sm">
                Select any font from the table below to preview. Click "Apply Font" to change the site font.
              </AlertDescription>
            </Alert>
            
            <div className="border border-white/10 rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-black/40">
                    <TableHead>Font Name</TableHead>
                    <TableHead>Preview</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableFonts.map((font) => (
                    <TableRow 
                      key={font.value} 
                      className={`bg-black/20 ${previewFont === font.value ? 'bg-white/10' : ''}`}
                    >
                      <TableCell className="font-medium">{font.label}</TableCell>
                      <TableCell>
                        <span className={`font-${font.value}`}>
                          The quick brown fox jumps over the lazy dog
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleFontChange(font.value)}
                          >
                            Preview
                          </Button>
                          <Button 
                            variant={fontFamily === font.value ? "secondary" : "default"}
                            size="sm"
                            onClick={() => applyFont(font.value)}
                            disabled={fontFamily === font.value}
                            className={fontFamily === font.value ? "bg-green-900/20 text-green-400 hover:bg-green-900/30" : ""}
                          >
                            {fontFamily === font.value ? (
                              <>
                                <Check className="mr-1 h-4 w-4" />
                                Applied
                              </>
                            ) : "Apply"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-between items-center pt-4">
              <div>
                <p className="text-sm text-gray-400">Current Site Font: <span className="text-white font-medium">{getFontLabelByValue(fontFamily)}</span></p>
                <p className="text-sm text-gray-400">Preview Font: <span className="text-white font-medium">{getFontLabelByValue(previewFont)}</span></p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={resetPreview}
                disabled={previewFont === fontFamily}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Reset Preview
              </Button>
            </div>
            
            <div className="rounded-lg border border-white/10 p-4 mt-4">
              <h3 className="text-sm font-medium mb-2">Preview Text</h3>
              <div className={`font-${previewFont}`}>
                <p className="mb-2">This is how text will look across the site.</p>
                <h2 className="text-xl font-bold mb-2">Heading Example</h2>
                <p className="mb-2">EnderHOST provides premium Minecraft server hosting with 24/7 support and powerful hardware.</p>
                <p><a href="#" className="text-minecraft-primary underline">Link Example</a></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FontManagement;
