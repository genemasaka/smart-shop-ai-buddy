
import { useState, useCallback } from "react";
import { ShoppingListInput } from "@/components/shopping/ShoppingListInput";
import { ShoppingCart } from "@/components/shopping/ShoppingCart";
import { ShoppingListItem, processShoppingList, Product } from "@/services/productService";
import { useToast } from "@/components/ui/use-toast";

const ShoppingList = () => {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmitList = async (listText: string) => {
    setIsProcessing(true);
    
    try {
      // Process each item and update the UI as they complete
      await processShoppingList(listText, (updatedItem) => {
        setItems(currentItems => {
          const itemIndex = currentItems.findIndex(item => item.id === updatedItem.id);
          
          if (itemIndex >= 0) {
            // Update existing item
            const newItems = [...currentItems];
            newItems[itemIndex] = updatedItem;
            return newItems;
          } else {
            // Add new item
            return [...currentItems, updatedItem];
          }
        });
      });
      
      toast({
        title: "Shopping list processed",
        description: "We've found matching products for your items.",
      });
    } catch (error) {
      console.error("Error processing shopping list:", error);
      toast({
        title: "Error processing list",
        description: "There was a problem processing your shopping list.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateQuantity = useCallback((id: string, quantity: number) => {
    setItems(currentItems => 
      currentItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  }, []);

  const handleSelectAlternative = useCallback((id: string, product: Product) => {
    setItems(currentItems => 
      currentItems.map(item => 
        item.id === id ? { ...item, product } : item
      )
    );
  }, []);

  const handleReset = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 space-y-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-1">Shopping List</h1>
        <p className="text-muted-foreground mb-6">
          Enter your shopping list and let AI find the best products
        </p>
        
        <div className="space-y-8">
          <ShoppingListInput 
            onSubmit={handleSubmitList}
            isProcessing={isProcessing}
          />
          
          <ShoppingCart 
            items={items}
            onUpdateQuantity={handleUpdateQuantity}
            onSelectAlternative={handleSelectAlternative}
            onReset={handleReset}
          />
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;
