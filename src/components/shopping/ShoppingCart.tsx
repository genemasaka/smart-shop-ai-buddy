
import { useState, useMemo } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingListItem, checkoutCart } from "@/services/productService";
import { ProductCard } from "./ProductCard";
import { ShoppingBag, ShoppingCart as CartIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ShoppingCartProps {
  items: ShoppingListItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onSelectAlternative: (id: string, product: any) => void;
  onReset: () => void;
}

export function ShoppingCart({
  items,
  onUpdateQuantity,
  onSelectAlternative,
  onReset
}: ShoppingCartProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [store, setStore] = useState<"Walmart" | "Instacart">("Walmart");
  const { toast } = useToast();

  const storeItems = useMemo(() => {
    // Filter items that have products from the selected store
    return items.filter(item => 
      item.product && item.product.store === store
    );
  }, [items, store]);

  const subtotal = useMemo(() => {
    return storeItems.reduce((sum, item) => 
      sum + (item.product?.price || 0) * item.quantity, 0
    );
  }, [storeItems]);

  const itemsStillProcessing = items.some(item => item.isProcessing);

  const handleCheckout = async () => {
    if (storeItems.length === 0) {
      toast({
        title: "No items to checkout",
        description: `There are no items from ${store} in your cart.`,
        variant: "destructive",
      });
      return;
    }
    
    setIsCheckingOut(true);
    
    try {
      const success = await checkoutCart(storeItems, store);
      
      if (success) {
        toast({
          title: "Order placed successfully!",
          description: `Your order from ${store} has been placed.`,
        });
      } else {
        toast({
          title: "Checkout failed",
          description: "There was a problem placing your order. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout failed",
        description: "There was a problem placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Count items by store
  const walmartCount = items.filter(item => 
    item.product && item.product.store === "Walmart"
  ).length;
  
  const instacartCount = items.filter(item => 
    item.product && item.product.store === "Instacart"
  ).length;

  if (items.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 flex flex-col items-center justify-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">Your shopping list is empty</h3>
          <p className="text-muted-foreground text-center">
            Enter your shopping list above to get started with AI-powered product matching
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CartIcon className="h-5 w-5 mr-2" />
          Your Shopping Cart
        </CardTitle>
      </CardHeader>
      
      <Tabs defaultValue="Walmart" value={store} onValueChange={(v) => setStore(v as "Walmart" | "Instacart")}>
        <div className="px-6">
          <TabsList className="w-full">
            <TabsTrigger value="Walmart" className="flex-1">
              Walmart{walmartCount > 0 && <span className="ml-2 bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">{walmartCount}</span>}
            </TabsTrigger>
            <TabsTrigger value="Instacart" className="flex-1">
              Instacart{instacartCount > 0 && <span className="ml-2 bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">{instacartCount}</span>}
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="Walmart" className="mt-4">
          <CardContent className="space-y-4">
            {itemsStillProcessing && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Processing your shopping list...</p>
                <Progress value={items.filter(i => !i.isProcessing).length / items.length * 100} className="h-2" />
              </div>
            )}
            
            {storeItems.length > 0 ? (
              storeItems.map(item => (
                <ProductCard 
                  key={item.id}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onSelectAlternative={onSelectAlternative}
                />
              ))
            ) : (
              <div className="p-8 flex flex-col items-center justify-center">
                <p className="text-muted-foreground text-center">
                  No items from Walmart in your cart
                </p>
              </div>
            )}
          </CardContent>
        </TabsContent>
        
        <TabsContent value="Instacart" className="mt-4">
          <CardContent className="space-y-4">
            {itemsStillProcessing && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Processing your shopping list...</p>
                <Progress value={items.filter(i => !i.isProcessing).length / items.length * 100} className="h-2" />
              </div>
            )}
            
            {items.filter(item => item.product?.store === "Instacart").length > 0 ? (
              items.filter(item => item.product?.store === "Instacart").map(item => (
                <ProductCard 
                  key={item.id}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onSelectAlternative={onSelectAlternative}
                />
              ))
            ) : (
              <div className="p-8 flex flex-col items-center justify-center">
                <p className="text-muted-foreground text-center">
                  No items from Instacart in your cart
                </p>
              </div>
            )}
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex flex-col space-y-4 pt-4 border-t">
        <div className="w-full flex items-center justify-between">
          <span className="font-medium">Subtotal ({storeItems.length} items):</span>
          <span className="font-bold text-lg">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex w-full space-x-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onReset}
            disabled={isCheckingOut || itemsStillProcessing}
          >
            Clear All
          </Button>
          <Button
            className="flex-1"
            onClick={handleCheckout}
            disabled={storeItems.length === 0 || isCheckingOut || itemsStillProcessing}
          >
            {isCheckingOut ? "Processing..." : `Checkout with ${store}`}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
