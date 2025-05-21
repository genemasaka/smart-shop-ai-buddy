
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCategory } from "@/services/productService";

interface CategoryResponse {
  category: string;
  confidence: number;
  rawResponse: any;
}

/**
 * Custom hook to fetch category for a shopping list item
 * @param item The shopping list item to categorize
 * @param options Additional options for the query
 * @returns Query result with category data
 */
export const useCategoryQuery = (
  item: string | null | undefined,
  options: {
    enabled?: boolean;
    onSuccess?: (data: CategoryResponse) => void;
    onError?: (error: Error) => void;
  } = {}
) => {
  return useQuery({
    queryKey: ["categorize", item],
    queryFn: async (): Promise<CategoryResponse> => {
      if (!item) {
        throw new Error("Item is required");
      }
      
      const { data, error } = await supabase.functions.invoke("categorizeItem", {
        body: { item },
      });
      
      if (error) {
        console.error("Error invoking categorizeItem function:", error);
        throw new Error(error.message);
      }
      
      return data as CategoryResponse;
    },
    enabled: !!item && (options.enabled !== false),
    ...options,
  });
};

/**
 * Maps a category string from the API to a ProductCategory type
 */
export const mapToProductCategory = (category: string): ProductCategory => {
  const categoryMap: Record<string, ProductCategory> = {
    "Dairy": "Dairy",
    "Produce": "Produce",
    "Cleaning": "Cleaning Supplies",
    "Pantry": "Pantry",
    "Beverages": "Beverages", 
    "Personal Care": "Health and Beauty",
    "Household": "Household",
    "Electronics": "Electronics"
  };
  
  return categoryMap[category] || "Uncategorized";
};
