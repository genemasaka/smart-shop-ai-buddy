
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { setHuggingFaceApiToken, getHuggingFaceApiToken } from "@/services/huggingFaceService";

interface ApiTokenSetupProps {
  onTokenSet: () => void;
}

export function ApiTokenSetup({ onTokenSet }: ApiTokenSetupProps) {
  const [token, setToken] = useState("");
  const [hasToken, setHasToken] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedToken = getHuggingFaceApiToken();
    if (savedToken) {
      setHasToken(true);
    }
  }, []);

  const handleSaveToken = () => {
    if (!token.trim()) {
      toast({
        title: "Invalid token",
        description: "Please enter a valid Hugging Face API token",
        variant: "destructive",
      });
      return;
    }

    setHuggingFaceApiToken(token);
    setHasToken(true);
    toast({
      title: "API token saved",
      description: "Hugging Face API token has been saved",
    });
    onTokenSet();
  };

  const handleReset = () => {
    setHuggingFaceApiToken("");
    setToken("");
    setHasToken(false);
    toast({
      title: "API token removed",
      description: "Hugging Face API token has been removed",
    });
  };

  if (hasToken) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Hugging Face API token is set and active.
            </p>
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset API Token
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Set Hugging Face API Token</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          To use advanced product classification, please enter your Hugging Face API token.
          You can get a token from your Hugging Face account settings.
        </p>
        <Input
          type="password"
          placeholder="Enter Hugging Face API token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveToken} className="w-full">
          Save API Token
        </Button>
      </CardFooter>
    </Card>
  );
}
