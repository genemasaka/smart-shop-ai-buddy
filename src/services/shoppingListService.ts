
import { supabase } from "@/integrations/supabase/client";
import { ShoppingListItem, Product, ProductCategory } from "@/services/productService";

export type ShoppingList = {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export const createShoppingList = async (userId: string, name = "Shopping List") => {
  try {
    // Create the shopping list - fixed to not use select in the insert operation
    const { data, error } = await supabase
      .from('shopping_lists')
      .insert({
        user_id: userId,
        name
      });

    if (error) {
      console.error("Error creating shopping list:", error);
      throw error;
    }

    // Fetch the created record in a separate query
    const { data: createdList, error: fetchError } = await supabase
      .from('shopping_lists')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError) {
      console.error("Error fetching created shopping list:", fetchError);
      throw fetchError;
    }

    return createdList;
  } catch (error) {
    console.error("Error in createShoppingList:", error);
    throw error;
  }
};

export const saveShoppingListItems = async (listId: string, items: ShoppingListItem[]) => {
  try {
    console.log("Saving items with listId:", listId);
    console.log("Items to save:", items);
    
    // Format items for Supabase, ensuring IDs are valid UUIDs
    const formattedItems = items.map(item => {
      // Always generate a new UUID if the existing ID isn't a valid UUID
      const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.id);
      const itemId = isValidUuid ? item.id : crypto.randomUUID();
      
      return {
        id: itemId,
        list_id: listId,
        text: item.text,
        category: item.category,
        product_id: item.product?.id,
        product_name: item.product?.name,
        product_price: item.product?.price,
        product_image: item.product?.image,
        product_store: item.product?.store,
        quantity: item.quantity,
      };
    });

    console.log("Formatted items:", formattedItems);

    const { error } = await supabase
      .from('shopping_list_items')
      .upsert(formattedItems, {
        onConflict: 'id'
      });

    if (error) {
      console.error("Error saving shopping list items:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error in saveShoppingListItems:", error);
    throw error;
  }
};

export const fetchShoppingListItems = async (listId: string): Promise<ShoppingListItem[]> => {
  const { data, error } = await supabase
    .from('shopping_list_items')
    .select('*')
    .eq('list_id', listId);

  if (error) {
    console.error("Error fetching shopping list items:", error);
    throw error;
  }

  // Transform back to our app's data model
  return data.map(item => {
    // Ensure store is either "Walmart" or "Instacart"
    const productStore = item.product_store as "Walmart" | "Instacart" | undefined;
    
    return {
      id: item.id,
      text: item.text,
      category: item.category as ProductCategory,
      quantity: item.quantity || 1,
      product: item.product_id ? {
        id: item.product_id,
        name: item.product_name || "",
        price: item.product_price || 0,
        image: item.product_image || "",
        store: productStore || "Walmart", // Default to Walmart if undefined
        category: item.category as ProductCategory,
        description: "", // Add missing description
        inStock: true, // Add missing inStock
      } : undefined,
      isProcessing: false
    };
  });
};

export const getUserShoppingLists = async (userId: string): Promise<ShoppingList[]> => {
  const { data, error } = await supabase
    .from('shopping_lists')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching shopping lists:", error);
    throw error;
  }

  return data.map(list => ({
    id: list.id,
    name: list.name,
    userId: list.user_id,
    createdAt: list.created_at,
    updatedAt: list.updated_at
  }));
};

export const deleteShoppingList = async (listId: string) => {
  const { error } = await supabase
    .from('shopping_lists')
    .delete()
    .eq('id', listId);

  if (error) {
    console.error("Error deleting shopping list:", error);
    throw error;
  }
  
  return true;
};
