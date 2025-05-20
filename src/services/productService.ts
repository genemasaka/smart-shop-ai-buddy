import { toast } from "sonner";

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
    id: "1",
    name: "Milk",
    description: "1 Gallon of Milk",
    price: 3.50,
    image: "/images/products/milk.jpg",
    category: "Dairy",
    store: "Walmart",
    inStock: true,
  },
  {
    id: "2",
    name: "Eggs",
    description: "1 Dozen Eggs",
    price: 2.75,
    image: "/images/products/eggs.jpg",
    category: "Dairy",
    store: "Walmart",
    inStock: true,
  },
  {
    id: "3",
    name: "Bread",
    description: "Loaf of White Bread",
    price: 2.20,
    image: "/images/products/bread.jpg",
    category: "Pantry",
    store: "Walmart",
    inStock: true,
  },
  {
    id: "4",
    name: "Apples",
    description: "1 lb of Apples",
    price: 1.99,
    image: "/images/products/apples.jpg",
    category: "Produce",
    store: "Walmart",
    inStock: true,
  },
  {
    id: "5",
    name: "Tomatoes",
    description: "1 lb of Tomatoes",
    price: 2.50,
    image: "/images/products/tomatoes.jpg",
    category: "Produce",
    store: "Walmart",
    inStock: true,
  },
  {
    id: "6",
    name: "Chicken Breast",
    description: "1 lb of Chicken Breast",
    price: 5.99,
    image: "/images/products/chicken.jpg",
    category: "Pantry",
    store: "Walmart",
    inStock: true,
  },
  {
    id: "7",
    name: "Pasta",
    description: "Box of Spaghetti",
    price: 1.20,
    image: "/images/products/pasta.jpg",
    category: "Pantry",
    store: "Walmart",
    inStock: true,
  },
  {
    id: "8",
    name: "Shampoo",
    description: "Bottle of Shampoo",
    price: 4.00,
    image: "/images/products/shampoo.jpg",
    category: "Health and Beauty",
    store: "Walmart",
    inStock: true,
  },
  {
    id: "9",
    name: "Conditioner",
    description: "Bottle of Conditioner",
    price: 4.20,
    image: "/images/products/conditioner.jpg",
    category: "Health and Beauty",
    store: "Walmart",
    inStock: true,
  },
  {
    id: "10",
    name: "Toothpaste",
    description: "Tube of Toothpaste",
    price: 2.80,
    image: "/images/products/toothpaste.jpg",
    category: "Health and Beauty",
    store: "Walmart",
    inStock: true,
  },
  {
    id: "11",
    name: "Paper Towels",
    description: "Roll of Paper Towels",
    price: 2.00,
    image: "/images/products/papertowels.jpg",
    category: "Household",
    store: "Walmart",
    inStock: true,
  },
  {
    id: "12",
    name: "Toilet Paper",
    description: "Pack of Toilet Paper",
    price: 6.50,
    image: "/images/products/toiletpaper.jpg",
    category: "Household",
    store: "Walmart",
    inStock: true,
  },
  {
    id: "13",
    name: "Laundry Detergent",
    description: "Bottle of Laundry Detergent",
    price: 7.00,
    image: "/images/products/laundrydetergent.jpg",
    category: "Household",
    store: "Walmart",
    inStock: true,
  },
  {
    id: "14",
    name: "Dish Soap",
    description: "Bottle of Dish Soap",
    price: 3.20,
    image: "/images/products/dishsoap.jpg",
    category: "Household",
    store: "Walmart",
    inStock: true,
  },
  {
    id: "15",
    name: "Trash Bags",
    description: "Box of Trash Bags",
    price: 8.00,
    image: "/images/products/trashbags.jpg",
    category: "Household",
    store: "Walmart",
    inStock: true,
  },
  {
    id: "16",
    name: "Coffee",
    description: "Can of Coffee",
    price: 6.00,
    image: "/images/products/coffee.jpg",
    category: "Beverages",
    store: "Walmart",
    inStock: true,
  },
  {
    id: "17",
    name: "Tea",
    description: "Box of Tea Bags",
    price: 3.50,
    image: "/images/products/tea.jpg",
    category: "Beverages",
    store: "Walmart",
    inStock: true,
  },
  {
    id: "18",
    name: "Juice",
    description: "Bottle of Juice",
    price: 4.00,
    image: "/images/products/juice.jpg",
    category: "Beverages",
    store: "Walmart",
    inStock: true,
  },
  {
    id: "19",
    name: "Soda",
    description: "Pack of Soda Cans",
    price: 5.50,
    image: "/images/products/soda.jpg",
    category: "Beverages",
    store: "Walmart",
    inStock: true,
  },
  {
    id: "20",
    name: "Water",
    description: "Pack of Water Bottles",
    price: 4.50,
    image: "/images/products/water.jpg",
    category: "Beverages",
    store: "Walmart",
    inStock: true,
  },
  {
    id: "21",
    name: "Laptop",
    description: "New Laptop Computer",
    price: 1200.00,
    image: "/images/products/laptop.jpg",
    category: "Electronics",
    store: "Walmart",
    inStock: true,
  },
  {
    id: "22",
    name: "Television",
    description: "4K Ultra HD Television",
    price: 800.00,
    image: "/images/products/television.jpg",
    category: "Electronics",
    store: "Walmart",
    inStock: true,
  },
  {
    id: "23",
    name: "Smartphone",
    description: "Latest Smartphone Model",
    price: 900.00,
    image: "/images/products/smartphone.jpg",
    category: "Electronics",
    store: "Walmart",
    inStock: true,
  },
  {
    id: "24",
    name: "Headphones",
    description: "Wireless Noise-Cancelling Headphones",
    price: 250.00,
    image: "/images/products/headphones.jpg",
    category: "Electronics",
    store: "Walmart",
    inStock: true,
  },
  {
    id: "25",
    name: "Tablet",
    description: "High-Resolution Tablet Computer",
    price: 400.00,
    image: "/images/products/tablet.jpg",
    category: "Electronics",
    store: "Walmart",
    inStock: true,
  },
];

// Mock AI categorization function
export const categorizeShoppingItem = async (text: string): Promise<ProductCategory> => {
  text = text.toLowerCase();

  if (text.includes("milk") || text.includes("cheese") || text.includes("yogurt") || text.includes("butter") || text.includes("cream")) {
    return "Dairy";
  } else if (text.includes("apple") || text.includes("banana") || text.includes("orange") || text.includes("tomato") || text.includes("potato") || text.includes("onion") || text.includes("cucumber")) {
    return "Produce";
  } else if (text.includes("detergent") || text.includes("soap") || text.includes("cleaner") || text.includes("bleach") || text.includes("wipes")) {
    return "Cleaning Supplies";
  } else if (text.includes("pasta") || text.includes("rice") || text.includes("cereal") || text.includes("flour") || text.includes("sugar") || text.includes("bread")) {
    return "Pantry";
  } else if (text.includes("coffee") || text.includes("tea") || text.includes("juice") || text.includes("soda") || text.includes("water")) {
    return "Beverages";
  } else if (text.includes("shampoo") || text.includes("conditioner") || text.includes("toothpaste") || text.includes("lotion") || text.includes("sunscreen")) {
    return "Health and Beauty";
  } else if (text.includes("towels") || text.includes("paper") || text.includes("toilet paper") || text.includes("trash bags") || text.includes("dish soap")) {
    return "Household";
  } else if (text.includes("laptop") || text.includes("television") || text.includes("smartphone") || text.includes("headphones") || text.includes("tablet")) {
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
  text = text.toLowerCase();
  
  let matches = mockProducts.filter(product => {
    const nameMatches = product.name.toLowerCase().includes(text);
    const categoryMatches = product.category === category;
    
    return nameMatches && categoryMatches;
  });

  if (preferredStore) {
    matches = matches.filter(product => product.store.toLowerCase() === preferredStore.toLowerCase());
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
        
        // Fixed: No dynamic imports
        toast({
          title: "Error",
          description: `Failed to process "${itemText}". Please try again.`,
        });
      }
    }
    
    return items;
  } catch (error) {
    console.error("Error processing shopping list:", error);
    // Fixed: No dynamic imports
    toast({
      title: "Error",
      description: "Failed to process shopping list. Please try again.",
    });
    return items;
  }
};

// Function to simulate checkout - updated to match how it's called
export const checkoutCart = async (items: ShoppingListItem[]): Promise<boolean> => {
  // Simulate checkout process delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real app, this would redirect to the store's API
  // For demo, we'll just return true
  return true;
};
