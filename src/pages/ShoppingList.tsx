import { useState, useCallback, useEffect } from "react";
import { ShoppingListInput } from "@/components/shopping/ShoppingListInput";
import { ShoppingCart } from "@/components/shopping/ShoppingCart";
import { ShoppingListItem, processShoppingList, Product } from "@/services/productService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { createShoppingList, saveShoppingListItems } from "@/services/shoppingListService";
import { useCategoryQuery, mapToProductCategory } from "@/hooks/useCategoryQuery";

const ShoppingList = () => {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentListId, setCurrentListId] = useState<string | null>(null);
  const [currentProcessingItem, setCurrentProcessingItem] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Use our new hook to get AI categorization
  const { data: categoryData } = useCategoryQuery(currentProcessingItem, {
    enabled: !!currentProcessingItem,
    onSuccess: (data) => {
      if (currentProcessingItem) {
        processItemWithCategory(currentProcessingItem, mapToProductCategory(data.category));
        setCurrentProcessingItem(null); // Reset for next item
      }
    },
    onError: () => {
      // If categorization fails, process with default categorization
      if (currentProcessingItem) {
        processItemWithDefaultCategorization(currentProcessingItem);
        setCurrentProcessingItem(null);
      }
    }
  });

  const processItemWithCategory = async (itemText: string, category: string) => {
    try {
      // Create a new item with AI-predicted category
      const newItem: ShoppingListItem = {
        id: crypto.randomUUID(),
        text: itemText,
        category: category,
        quantity: 1,
        isProcessing: true
      };
      
      // Add to items list
      setItems(prevItems => [...prevItems, newItem]);
      
      // Find matching products with the AI-predicted category
      const matchingProducts = await findMatchingProducts(itemText, category);
      
      // Update the item with product
      const updatedItem: ShoppingListItem = {
        ...newItem,
        product: matchingProducts.length > 0 ? matchingProducts[0] : undefined,
        isProcessing: false
      };
      
      // Replace the item in the list
      setItems(prevItems => 
        prevItems.map(item => item.id === newItem.id ? updatedItem : item)
      );
      
    } catch (error) {
      console.error(`Error processing item with AI category "${itemText}":`, error);
      processItemWithDefaultCategorization(itemText);
    }
  };

  const processItemWithDefaultCategorization = (itemText: string) => {
    console.log("Using default categorization for:", itemText);
    // Process using the existing categorization logic instead
    const processItem = async () => {
      const initialItem: ShoppingListItem = {
        id: crypto.randomUUID(),
        text: itemText,
        category: "Uncategorized",
        quantity: 1,
        isProcessing: true
      };
      
      setItems(prevItems => [...prevItems, initialItem]);
      
      try {
        // Import functions directly instead of using require
        const { categorizeShoppingItem, findMatchingProducts } = await import("@/services/productService");
        
        const category = await categorizeShoppingItem(itemText);
        const matchingProducts = await findMatchingProducts(itemText, category);
        
        const updatedItem: ShoppingListItem = {
          ...initialItem,
          category,
          product: matchingProducts.length > 0 ? matchingProducts[0] : undefined,
          isProcessing: false
        };
        
        setItems(prevItems => 
          prevItems.map(item => item.id === initialItem.id ? updatedItem : item)
        );
      } catch (error) {
        console.error(`Error in default categorization for "${itemText}":`, error);
        
        setItems(prevItems => 
          prevItems.map(item => 
            item.id === initialItem.id 
              ? { ...item, isProcessing: false } 
              : item
          )
        );
      }
    };
    
    processItem();
  };

  // Import functions from productService separately
  // We'll use dynamic imports instead of require
  const findMatchingProducts = async (itemText: string, category: string) => {
    const { findMatchingProducts } = await import("@/services/productService");
    return findMatchingProducts(itemText, category);
  };

  const handleSubmitList = async (listText: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a shopping list.",
        variant: "destructive",
      });
      return;
    }

    if (!listText.trim()) {
      toast({
        title: "Empty list",
        description: "Please enter some items in your shopping list.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setItems([]); // Clear previous items when starting a new process
    
    try {
      // Create a new shopping list in database
      const list = await createShoppingList(user.id);
      console.log("Created shopping list:", list);
      setCurrentListId(list.id);
      
      // Split by commas or new lines
      const itemTexts = listText
        .split(/[,\n]+/)
        .map(item => item.trim())
        .filter(item => item.length > 0);
      
      // Process each item one by one with AI categorization
      for (const itemText of itemTexts) {
        // Process current item with AI
        setCurrentProcessingItem(itemText);
        // Wait for the AI to process each item (handled by the query hook's onSuccess/onError)
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Save all items to the database
      if (items.length > 0 && list.id) {
        await saveShoppingListItems(list.id, items);
        
        toast({
          title: "Shopping list processed",
          description: "We've found matching products for your items.",
        });
      } else {
        toast({
          title: "No items processed",
          description: "No items were found in your list.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error processing shopping list:", error);
      toast({
        title: "Error processing list",
        description: "There was a problem processing your shopping list.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setCurrentProcessingItem(null);
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
      const updatedItem = items.find(item => item.id === id);
      if (updatedItem) {
        const updatedItems = items.map(item => 
          item.id === id ? { ...item, quantity } : item
        );
        saveShoppingListItems(currentListId, updatedItems).catch(error => {
          console.error("Error saving updated quantity:", error);
        });
      }
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
