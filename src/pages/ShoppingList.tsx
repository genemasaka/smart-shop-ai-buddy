import { useState, useCallback, useEffect } from "react";
import { ShoppingListInput } from "@/components/shopping/ShoppingListInput";
import { ShoppingCart } from "@/components/shopping/ShoppingCart";
import { ShoppingListItem, processShoppingList, Product } from "@/services/productService";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { createShoppingList, saveShoppingListItems } from "@/services/shoppingListService";
import { v4 as uuidv4 } from "uuid";

const ShoppingList = () => {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentListId, setCurrentListId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmitList = async (listText: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a shopping list.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setItems([]); // Clear previous items when starting a new process
    
    try {
      // Create a new shopping list in database
      const list = await createShoppingList(user.id);
      setCurrentListId(list.id);
      
      // Process each item and update the UI as they complete
      const processedItems = await processShoppingList(listText, (updatedItem) => {
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
      
      // Save all items to the database
      if (processedItems.length > 0 && list.id) {
        await saveShoppingListItems(list.id, processedItems);
      }
      
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
    
    // Save changes to database if we have a list ID
    if (currentListId && user) {
      const updatedItems = items.map(item => 
        item.id === id ? { ...item, quantity } : item
      );
      saveShoppingListItems(currentListId, updatedItems).catch(error => {
        console.error("Error saving updated quantity:", error);
      });
    }
  }, [items, currentListId, user]);

  const handleSelectAlternative = useCallback((id: string, product: Product) => {
    setItems(currentItems => 
      currentItems.map(item => 
        item.id === id ? { ...item, product } : item
      )
    );
    
    // Save changes to database if we have a list ID
    if (currentListId && user) {
      const updatedItems = items.map(item => 
        item.id === id ? { ...item, product } : item
      );
      saveShoppingListItems(currentListId, updatedItems).catch(error => {
        console.error("Error saving product selection:", error);
      });
    }
  }, [items, currentListId, user]);

  const handleReset = useCallback(() => {
    setItems([]);
    setCurrentListId(null);
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
