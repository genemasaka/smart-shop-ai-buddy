import { toast } from "@/hooks/use-toast";

// Product categories
export type ProductCategory = 
  | "Dairy" 
  | "Produce" 
  | "Cleaning Supplies" 
  | "Pantry" 
  | "Beverages" 
  | "Health and Beauty" 
  | "Household" 
  | "Electronics"
  | "Uncategorized";

// Product interface
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
  store: "Walmart" | "Instacart";
  inStock: boolean;
}

// Shopping list item with user input and matched product
export interface ShoppingListItem {
  id: string;
  text: string;
  category: ProductCategory;
  product?: Product;
  quantity: number;
  isProcessing: boolean;
}

// Mock product database
const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Organic Whole Milk",
    description: "1 Gallon, Grade A, Pasteurized",
    price: 4.99,
    image: "https://i.imgur.com/JgzrFgH.jpg",
    category: "Dairy",
    store: "Walmart",
    inStock: true
  },
  {
    id: "p2",
    name: "Large Brown Eggs",
    description: "12 count, Grade A, Free Range",
    price: 3.49,
    image: "https://i.imgur.com/YtY24Ys.jpg",
    category: "Dairy",
    store: "Instacart",
    inStock: true
  },
  {
    id: "p3",
    name: "Organic Bananas",
    description: "Bunch, Approximately 5-7",
    price: 1.99,
    image: "https://i.imgur.com/OuPA1h5.jpg",
    category: "Produce",
    store: "Walmart",
    inStock: true
  },
  {
    id: "p4",
    name: "Red Delicious Apples",
    description: "3 lb Bag",
    price: 4.49,
    image: "https://i.imgur.com/vytmuFP.jpg",
    category: "Produce",
    store: "Instacart",
    inStock: true
  },
  {
    id: "p5",
    name: "All-Purpose Cleaner",
    description: "32 oz Spray Bottle",
    price: 3.99,
    image: "https://i.imgur.com/fMXtCxv.jpg",
    category: "Cleaning Supplies",
    store: "Walmart",
    inStock: true
  },
  {
    id: "p6",
    name: "Paper Towels",
    description: "6 Roll Pack, Select-A-Size",
    price: 8.99,
    image: "https://i.imgur.com/T0qUimb.jpg",
    category: "Household",
    store: "Instacart",
    inStock: true
  },
  {
    id: "p7",
    name: "White Rice",
    description: "5 lb Bag, Long Grain",
    price: 4.29,
    image: "https://i.imgur.com/b2vOOYF.jpg",
    category: "Pantry",
    store: "Walmart",
    inStock: true
  },
  {
    id: "p8",
    name: "Pasta Sauce",
    description: "24 oz Jar, Traditional",
    price: 2.79,
    image: "https://i.imgur.com/XyoYcBC.jpg",
    category: "Pantry",
    store: "Instacart",
    inStock: true
  },
  {
    id: "p9",
    name: "Coffee",
    description: "12 oz Bag, Medium Roast, Ground",
    price: 7.99,
    image: "https://i.imgur.com/USoYfLn.jpg",
    category: "Beverages",
    store: "Walmart",
    inStock: true
  },
  {
    id: "p10",
    name: "Orange Juice",
    description: "59 oz Carton, Pulp Free",
    price: 3.49,
    image: "https://i.imgur.com/4FrXsWO.jpg",
    category: "Beverages",
    store: "Instacart",
    inStock: true
  },
  {
    id: "p11",
    name: "Shampoo",
    description: "16 oz Bottle, For All Hair Types",
    price: 5.99,
    image: "https://i.imgur.com/5hf5B2m.jpg",
    category: "Health and Beauty",
    store: "Walmart",
    inStock: true
  },
  {
    id: "p12",
    name: "Toothpaste",
    description: "6 oz Tube, Mint Flavor",
    price: 2.99,
    image: "https://i.imgur.com/RBqfb8k.jpg",
    category: "Health and Beauty",
    store: "Instacart",
    inStock: true
  },
  {
    id: "p13",
    name: "Laundry Detergent",
    description: "100 oz Bottle, HE Compatible",
    price: 11.99,
    image: "https://i.imgur.com/FD8VHnL.jpg",
    category: "Household",
    store: "Walmart",
    inStock: true
  },
  {
    id: "p14",
    name: "Trash Bags",
    description: "45 Count, 13 Gallon",
    price: 8.49,
    image: "https://i.imgur.com/EA4JO6r.jpg",
    category: "Household",
    store: "Instacart",
    inStock: true
  },
  {
    id: "p15",
    name: "HDMI Cable",
    description: "6 ft, 4K Compatible",
    price: 9.99,
    image: "https://i.imgur.com/F8BRqAm.jpg",
    category: "Electronics",
    store: "Walmart",
    inStock: true
  }
];

// Mock AI categorization function
// In a real app, this would call the Hugging Face model API
export const categorizeShoppingItem = async (text: string): Promise<ProductCategory> => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simple keyword matching for demo purposes
  const textLower = text.toLowerCase();
  
  if (textLower.includes("milk") || textLower.includes("cheese") || textLower.includes("yogurt") || textLower.includes("butter") || textLower.includes("egg")) {
    return "Dairy";
  } else if (textLower.includes("apple") || textLower.includes("banana") || textLower.includes("vegetable") || textLower.includes("fruit") || textLower.includes("carrot") || textLower.includes("lettuce")) {
    return "Produce";
  } else if (textLower.includes("cleaner") || textLower.includes("detergent") || textLower.includes("soap") || textLower.includes("bleach")) {
    return "Cleaning Supplies";
  } else if (textLower.includes("rice") || textLower.includes("pasta") || textLower.includes("cereal") || textLower.includes("flour") || textLower.includes("sugar") || textLower.includes("oil")) {
    return "Pantry";
  } else if (textLower.includes("water") || textLower.includes("soda") || textLower.includes("juice") || textLower.includes("coffee") || textLower.includes("tea")) {
    return "Beverages";
  } else if (textLower.includes("shampoo") || textLower.includes("toothpaste") || textLower.includes("lotion") || textLower.includes("makeup")) {
    return "Health and Beauty";
  } else if (textLower.includes("paper towel") || textLower.includes("trash bag") || textLower.includes("light bulb") || textLower.includes("batteries")) {
    return "Household";
  } else if (textLower.includes("cable") || textLower.includes("phone") || textLower.includes("charger") || textLower.includes("computer") || textLower.includes("tv")) {
    return "Electronics";
  } else {
    return "Uncategorized";
  }
};

// Find matching products based on text and category
export const findMatchingProducts = async (
  text: string, 
  category: ProductCategory,
  preferredStore?: string
): Promise<Product[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const textLower = text.toLowerCase();
  
  // Filter products by category and text match
  let matches = mockProducts.filter(product => {
    if (product.category !== category) {
      return false;
    }
    
    return (
      product.name.toLowerCase().includes(textLower) ||
      product.description.toLowerCase().includes(textLower)
    );
  });
  
  // If no exact matches, return any products in the category
  if (matches.length === 0) {
    matches = mockProducts.filter(product => product.category === category);
  }
  
  // Filter by preferred store if specified
  if (preferredStore && matches.length > 0) {
    const storeMatches = matches.filter(product => product.store === preferredStore);
    if (storeMatches.length > 0) {
      matches = storeMatches;
    }
  }
  
  return matches;
};

// Process shopping list text into individual items
export const processShoppingList = async (
  listText: string,
  callback: (item: ShoppingListItem) => void
): Promise<ShoppingListItem[]> => {
  // Split by commas or new lines
  const itemTexts = listText
    .split(/[,\n]+/)
    .map(item => item.trim())
    .filter(item => item.length > 0);
  
  const items: ShoppingListItem[] = [];
  
  try {
    for (const itemText of itemTexts) {
      const itemId = `item_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      // Create initial item
      const newItem: ShoppingListItem = {
        id: itemId,
        text: itemText,
        category: "Uncategorized",
        quantity: 1,
        isProcessing: true
      };
      
      // Add to items list
      items.push(newItem);
      callback(newItem);
      
      try {
        // Categorize the item
        const category = await categorizeShoppingItem(itemText);
        
        // Find matching products
        const matchingProducts = await findMatchingProducts(itemText, category);
        
        // Update the item with category and product
        const updatedItem: ShoppingListItem = {
          ...newItem,
          category,
          product: matchingProducts.length > 0 ? matchingProducts[0] : undefined,
          isProcessing: false
        };
        
        // Replace the item in the list
        const index = items.findIndex(item => item.id === itemId);
        if (index !== -1) {
          items[index] = updatedItem;
        }
        
        callback(updatedItem);
      } catch (error) {
        console.error(`Error processing item "${itemText}":`, error);
        // Update the item to show it's no longer processing but had an error
        const index = items.findIndex(item => item.id === itemId);
        if (index !== -1) {
          items[index].isProcessing = false;
          callback(items[index]);
        }
      }
    }
    
    return items;
  } catch (error) {
    console.error("Error processing shopping list:", error);
    return items;
  }
};

// Function to simulate checkout
export const checkoutCart = async (
  items: ShoppingListItem[],
  store: "Walmart" | "Instacart"
): Promise<boolean> => {
  // Simulate checkout process delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real app, this would redirect to the store's API
  // For demo, we'll just return true
  return true;
};
