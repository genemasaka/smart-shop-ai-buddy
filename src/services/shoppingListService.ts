import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { ShoppingListItem, Product, ProductCategory } from "@/services/productService";

export type ShoppingList = {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export const createShoppingList = async (userId: string, name = "Shopping List") => {
  const { data, error } = await supabase
    .from('shopping_lists')
    .insert({
      user_id: userId,
      name
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating shopping list:", error);
    throw error;
  }

  return data;
};

export const saveShoppingListItems = async (listId: string, items: ShoppingListItem[]) => {
  // Format items for Supabase
  const formattedItems = items.map(item => ({
    id: item.id,
    list_id: listId,
    text: item.text,
    category: item.category,
    product_id: item.product?.id,
    product_name: item.product?.name,
    product_price: item.product?.price,
    product_image: item.product?.image,
    product_store: item.product?.store,
    quantity: item.quantity,
  }));

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
  return data.map(item => ({
    id: item.id,
    text: item.text,
    category: item.category as ProductCategory,
    quantity: item.quantity || 1,
    product: item.product_id ? {
      id: item.product_id,
      name: item.product_name || "",
      price: item.product_price || 0,
      image: item.product_image || "",
      store: item.product_store || "",
      category: item.category as ProductCategory, // Add missing category
      description: "", // Add missing description
      inStock: true, // Add missing inStock
      alternatives: []
    } : undefined,
    alternatives: [],
    isProcessing: false
  }));
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
