
// src/components/shopping/ShoppingCart.tsx
import { useState } from "react";
import { ShoppingListItem, Product } from "@/services/productService";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { checkoutCart } from "@/services/productService";

interface ShoppingCartProps {
  items: ShoppingListItem[];
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onSelectAlternative?: (id: string, product: Product) => void;
  onReset?: () => void;
  onCheckoutComplete?: () => void;
}

export function ShoppingCart({ 
  items, 
  onUpdateQuantity, 
  onSelectAlternative, 
  onReset, 
  onCheckoutComplete 
}: ShoppingCartProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { toast } = useToast();

  const handleCheckout = async (store: "Walmart" | "Instacart") => {
    setIsCheckingOut(true);
    try {
      await checkoutCart(items);
      toast({
        title: `Checkout complete with ${store}`,
        description: "Your order has been placed successfully!",
      });
      if (onCheckoutComplete) {
        onCheckoutComplete();
      } else if (onReset) {
        onReset(); // Use onReset as fallback if onCheckoutComplete is not provided
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return <p className="text-muted-foreground">Your cart is empty.</p>;
  }

  return (
    <div className="space-y-4">
      <ul>
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between">
            <span>{item.text}</span>
            <span>Quantity: {item.quantity}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between">
        <Button
          onClick={() => handleCheckout("Walmart")}
          disabled={isCheckingOut}
        >
          Checkout with Walmart
        </Button>
        <Button
          onClick={() => handleCheckout("Instacart")}
          disabled={isCheckingOut}
        >
          Checkout with Instacart
        </Button>
      </div>
    </div>
  );
}
