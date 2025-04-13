
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
import { generateId } from "@/lib/adminAuth";

interface RedeemCode {
  code: string;
  discountAmount: number;
  discountType: 'percent' | 'fixed';
  expiryDate: string;
  used: boolean;
  created: string;
}

const API_BASE_URL = '/api';

const RedeemCodeManager = () => {
  const { toast } = useToast();
  const [discountAmount, setDiscountAmount] = useState<number>(10);
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [expiryDays, setExpiryDays] = useState<number>(30);
  const [codeLength, setCodeLength] = useState<number>(8);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [codes, setCodes] = useState<RedeemCode[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load existing codes on mount
  useEffect(() => {
    fetchRedeemCodes();
  }, []);

  const fetchRedeemCodes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/redeem/get-codes.php`);
      const data = await response.json();
      
      if (data.success) {
        setCodes(data.codes || []);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to load redeem codes",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching redeem codes:", error);
      toast({
        title: "Error",
        description: "Failed to load redeem codes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < codeLength; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedCode(result);
  };

  const saveCode = async () => {
    if (!generatedCode) {
      toast({
        title: "Error",
        description: "Please generate a code first",
        variant: "destructive",
      });
      return;
    }

    // Calculate expiry date
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/redeem/create-code.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: generatedCode,
          discountAmount,
          discountType,
          expiryDate: expiryDate.toISOString(),
          created: new Date().toISOString(),
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: `Code ${generatedCode} generated successfully`,
        });
        
        // Reset form
        setGeneratedCode("");
        
        // Refresh code list
        fetchRedeemCodes();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to save redeem code",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving redeem code:", error);
      toast({
        title: "Error",
        description: "Failed to save redeem code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCode = async (codeToDelete: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/redeem/delete-code.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: codeToDelete,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Code deleted",
          description: `Code ${codeToDelete} has been deleted`,
        });
        
        // Refresh code list
        fetchRedeemCodes();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete redeem code",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting redeem code:", error);
      toast({
        title: "Error",
        description: "Failed to delete redeem code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-black/40 border border-white/10 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-minecraft-secondary" />
          Generate Redeem Code
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            disabled={!generatedCode || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Save Redeem Code
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="bg-black/40 border border-white/10 rounded-xl p-6">
        <h3 className="font-medium text-white mb-4 flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-minecraft-secondary" />
          Active Redeem Codes ({codes.filter(c => !c.used).length})
        </h3>

        <div className="border border-white/10 rounded-lg overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
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
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : codes.length === 0 ? (
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
                          disabled={isLoading}
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

export default RedeemCodeManager;
