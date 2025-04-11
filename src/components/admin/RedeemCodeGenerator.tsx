
import { useState, useEffect } from "react";
import { KeyRound, X, Plus, Calendar, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RedeemCodeGeneratorProps {
  onClose: () => void;
}

interface RedeemCode {
  code: string;
  discountAmount: number;
  discountType: 'percent' | 'fixed';
  expiryDate: string;
  used: boolean;
  created: string;
}

const RedeemCodeGenerator = ({ onClose }: RedeemCodeGeneratorProps) => {
  const { toast } = useToast();
  const [discountAmount, setDiscountAmount] = useState<number>(10);
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [expiryDays, setExpiryDays] = useState<number>(30);
  const [codeLength, setCodeLength] = useState<number>(8);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [codes, setCodes] = useState<RedeemCode[]>([]);

  // Fixed: Use useEffect instead of useState for initialization
  useEffect(() => {
    const storedCodes = JSON.parse(localStorage.getItem('redeemCodes') || '[]');
    setCodes(storedCodes);
  }, []);

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < codeLength; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedCode(result);
  };

  const saveCode = () => {
    if (!generatedCode) {
      toast({
        title: "Error",
        description: "Please generate a code first",
        variant: "destructive",
      });
      return;
    }

    // Check if code already exists
    const existingCodes = JSON.parse(localStorage.getItem('redeemCodes') || '[]');
    const codeExists = existingCodes.some((c: RedeemCode) => c.code === generatedCode);
    
    if (codeExists) {
      toast({
        title: "Error",
        description: "This code already exists",
        variant: "destructive",
      });
      return;
    }

    // Calculate expiry date
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);

    const newCode: RedeemCode = {
      code: generatedCode,
      discountAmount,
      discountType,
      expiryDate: expiryDate.toISOString(),
      used: false,
      created: new Date().toISOString()
    };
    
    // Add new code
    const updatedCodes = [...existingCodes, newCode];
    
    // Save back to localStorage
    localStorage.setItem('redeemCodes', JSON.stringify(updatedCodes));
    
    // Update state
    setCodes(updatedCodes);
    
    toast({
      title: "Success",
      description: `Code ${generatedCode} generated successfully`,
    });
    
    // Reset form
    setGeneratedCode("");
  };

  const deleteCode = (codeToDelete: string) => {
    const updatedCodes = codes.filter(code => code.code !== codeToDelete);
    localStorage.setItem('redeemCodes', JSON.stringify(updatedCodes));
    setCodes(updatedCodes);
    
    toast({
      title: "Code deleted",
      description: `Code ${codeToDelete} has been deleted`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
      <div 
        className="bg-black/90 border border-white/20 rounded-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto backdrop-blur-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-minecraft-secondary" />
            Redeem Code Generator
          </h2>
          <Button 
            variant="ghost" 
            className="text-gray-400 hover:text-white p-1 h-auto rounded-full"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discountAmount" className="text-white/90">Discount Amount</Label>
              <div className="flex">
                <Input
                  id="discountAmount"
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  min={1}
                  className="bg-black/70 border-white/10 text-white"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="discountType" className="text-white/90">Discount Type</Label>
              <Select
                value={discountType}
                onValueChange={(value: 'percent' | 'fixed') => setDiscountType(value)}
              >
                <SelectTrigger className="bg-black/70 border-white/10 text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/10 text-white">
                  <SelectItem value="percent">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDays" className="text-white/90">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-minecraft-secondary" />
                  <span>Expiry (days)</span>
                </div>
              </Label>
              <Input
                id="expiryDays"
                type="number"
                value={expiryDays}
                onChange={(e) => setExpiryDays(Number(e.target.value))}
                min={1}
                className="bg-black/70 border-white/10 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="codeLength" className="text-white/90">Code Length</Label>
              <Input
                id="codeLength"
                type="number"
                value={codeLength}
                onChange={(e) => setCodeLength(Number(e.target.value))}
                min={4}
                max={16}
                className="bg-black/70 border-white/10 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="generatedCode" className="text-white/90">Generated Code</Label>
            <div className="flex gap-2">
              <Input
                id="generatedCode"
                value={generatedCode}
                onChange={(e) => setGeneratedCode(e.target.value.toUpperCase())}
                className="bg-black/70 border-white/10 text-white uppercase"
                placeholder="Click 'Generate' or type a custom code"
              />
              <Button 
                onClick={generateRandomCode}
                className="whitespace-nowrap bg-minecraft-secondary hover:bg-minecraft-primary"
              >
                Generate
              </Button>
            </div>
          </div>

          <Button 
            onClick={saveCode}
            className="w-full bg-gradient-to-r from-minecraft-primary to-minecraft-secondary hover:from-minecraft-primary/90 hover:to-minecraft-secondary/90"
            disabled={!generatedCode}
          >
            <Plus className="mr-2 h-4 w-4" />
            Save Redeem Code
          </Button>
        </div>

        <h3 className="font-medium text-white mb-2 flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-minecraft-secondary" />
          Active Redeem Codes ({codes.filter(c => !c.used).length})
        </h3>

        <div className="border border-white/10 rounded-lg overflow-hidden mb-6">
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-black/50">
                <tr>
                  <th className="text-left p-2 text-xs text-gray-400">CODE</th>
                  <th className="text-left p-2 text-xs text-gray-400">DISCOUNT</th>
                  <th className="text-left p-2 text-xs text-gray-400">EXPIRES</th>
                  <th className="text-left p-2 text-xs text-gray-400">STATUS</th>
                  <th className="p-2 text-xs text-gray-400"></th>
                </tr>
              </thead>
              <tbody>
                {codes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      No redeem codes found. Create one above.
                    </td>
                  </tr>
                ) : (
                  codes.map((code, index) => (
                    <tr key={code.code} className={`${index % 2 === 0 ? 'bg-black/40' : 'bg-black/20'} border-b border-white/5 last:border-none`}>
                      <td className="p-2 text-white font-mono">{code.code}</td>
                      <td className="p-2 text-gray-300">
                        {code.discountType === 'percent' 
                          ? `${code.discountAmount}%` 
                          : `₹${code.discountAmount}`}
                      </td>
                      <td className="p-2 text-gray-300">{formatDate(code.expiryDate)}</td>
                      <td className="p-2">
                        <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                          code.used 
                            ? 'bg-red-500/20 text-red-300' 
                            : 'bg-green-500/20 text-green-300'
                        }`}>
                          {code.used ? 'Used' : 'Active'}
                        </span>
                      </td>
                      <td className="p-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-7 w-7 p-0 rounded-full hover:bg-red-500/20 hover:text-red-400 text-gray-400"
                          onClick={() => deleteCode(code.code)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedeemCodeGenerator;
