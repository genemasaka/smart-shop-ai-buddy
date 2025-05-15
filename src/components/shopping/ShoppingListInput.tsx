
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ShoppingListInputProps {
  onSubmit: (listText: string) => void;
  isProcessing: boolean;
}

export function ShoppingListInput({ onSubmit, isProcessing }: ShoppingListInputProps) {
  const [listText, setListText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (listText.trim()) {
      onSubmit(listText.trim());
      // Don't clear the input until processing is complete
      // This is handled by the parent component
    }
  };

  const exampleItems = [
    "milk, eggs, butter",
    "apples, bananas, bread",
    "coffee, cereal, orange juice"
  ];

  const fillExample = (example: string) => {
    setListText(example);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">What do you need to buy?</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Textarea
            placeholder="Enter items separated by commas (e.g. milk, eggs, bread)"
            value={listText}
            onChange={(e) => setListText(e.target.value)}
            rows={4}
            className="resize-none"
            disabled={isProcessing}
          />
          <div className="mt-3">
            <p className="text-sm text-muted-foreground mb-2">Try one of these examples:</p>
            <div className="flex flex-wrap gap-2">
              {exampleItems.map((example, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  size="sm" 
                  type="button"
                  onClick={() => fillExample(example)}
                  disabled={isProcessing}
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isProcessing || !listText.trim()}
          >
            {isProcessing ? "Processing..." : "Find Products"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
