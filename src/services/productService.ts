import { toast } from "@/hooks/use-toast";

export type ProductCategory =
  | "Dairy & Alternatives"
  | "Fruits"
  | "Vegetables"
  | "Meat & Seafood"
  | "Bakery & Grains"
  | "Snacks"
  | "Beverages"
  | "Condiments & Spices"
  | "Frozen Foods"
  | "Pantry Staples"
  | "Personal Care"
  | "Household"
  | "Baby & Child Care"
  | "Pet Care"
  | "Health & Wellness"
  | "International Cuisine"
  | "Prepared Foods"
  | "Other"
  | "Uncategorized";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  store: "Walmart" | "Instacart";
	category: ProductCategory;
  description: string;
  inStock: boolean;
}

export interface ShoppingListItem {
  id: string;
  text: string;
  category: ProductCategory;
  quantity: number;
  product?: Product;
  isProcessing: boolean;
}

const mockProducts: Product[] = [
  {
    id: "milk_walmart",
    name: "Great Value Whole Milk, 1 Gallon",
    price: 3.50,
    image: "https://i5.walmartimages.com/asr/e4c4ca97-3714-446f-9c65-a99445c926f0.c3c39164a94938a85443c592bca90959.jpeg?odnHeight=2000&odnWidth=2000&odnBg=ffffff",
    store: "Walmart",
		category: "Dairy & Alternatives",
    description: "One gallon of Great Value whole milk.",
    inStock: true,
  },
  {
    id: "eggs_walmart",
    name: "Great Value Large Eggs, 12 Count",
    price: 2.00,
    image: "https://i5.walmartimages.com/asr/5164c824-9898-4599-b2c7-a5585a497cae.3b57ed4539d75f99258647afc9378219.jpeg?odnHeight=2000&odnWidth=2000&odnBg=ffffff",
    store: "Walmart",
		category: "Dairy & Alternatives",
    description: "A dozen large eggs from Great Value.",
    inStock: true,
  },
  {
    id: "butter_walmart",
    name: "Great Value Salted Butter, 1 lb",
    price: 4.00,
    image: "https://i5.walmartimages.com/asr/2534a573-4558-4441-9553-53371188a976.9e245a159a42cfcc29a235a1b3a9b4a5.jpeg?odnHeight=2000&odnWidth=2000&odnBg=ffffff",
    store: "Walmart",
		category: "Dairy & Alternatives",
    description: "One pound of salted butter from Great Value.",
    inStock: true,
  },
  {
    id: "milk_instacart",
    name: "Horizon Organic Whole Milk, 0.5 Gallon",
    price: 4.99,
    image: "https://d2d8wwwkmhfcva.cloudfront.net/800x/filters:fill(FFF,true):format(jpg)/d2lniltooz52yy.cloudfront.net/item_detail/picture18/bb9614a819ca4419b352691a76538c4a-1595873148.jpg",
    store: "Instacart",
		category: "Dairy & Alternatives",
    description: "Half gallon of Horizon Organic whole milk.",
    inStock: true,
  },
  {
    id: "eggs_instacart",
    name: "Pete and Gerry's Organic Eggs, 12 Count",
    price: 5.49,
    image: "https://d2d8wwwkmhfcva.cloudfront.net/800x/filters:fill(FFF,true):format(jpg)/d2lniltooz52yy.cloudfront.net/item_detail/picture18/c7e39a59194f4d92b09199b99a3efc61-1628186443.jpg",
    store: "Instacart",
		category: "Dairy & Alternatives",
    description: "A dozen organic eggs from Pete and Gerry's.",
    inStock: true,
  },
  {
    id: "butter_instacart",
    name: "Organic Valley Salted Butter, 1 lb",
    price: 7.99,
    image: "https://d2d8wwwkmhfcva.cloudfront.net/800x/filters:fill(FFF,true):format(jpg)/d2lniltooz52yy.cloudfront.net/item_detail/picture18/3c3e9c190afa4943959264299459a73f-1620843972.jpg",
    store: "Instacart",
		category: "Dairy & Alternatives",
    description: "One pound of salted butter from Organic Valley.",
    inStock: true,
  },
  {
    id: "apple_walmart",
    name: "Granny Smith Apples",
    price: 0.76,
    image: "https://i5.walmartimages.com/asr/f55c1c59-d044-452c-8316-4394509c5349.4ca39968f54065549407dab835434a64.jpeg?odnHeight=2000&odnWidth=2000&odnBg=ffffff",
    store: "Walmart",
		category: "Fruits",
    description: "Fresh Granny Smith Apples.",
    inStock: true,
  },
  {
    id: "banana_walmart",
    name: "Fresh Cavendish Bananas",
    price: 0.50,
    image: "https://i5.walmartimages.com/asr/4a98b241-ebca-4969-a191-3a55d599bca9.9c9968124e457dd4418f688a5dbf0c49.jpeg?odnHeight=2000&odnWidth=2000&odnBg=ffffff",
    store: "Walmart",
		category: "Fruits",
    description: "Fresh Cavendish Bananas.",
    inStock: true,
  },
  {
    id: "bread_walmart",
    name: "Wonder Bread Classic White Bread, 20 oz Loaf",
    price: 2.28,
    image: "https://i5.walmartimages.com/asr/f394c1c1-7539-449c-9e23-c9c09c84d429.393335c7e447949866a7549264c7c587.jpeg?odnHeight=2000&odnWidth=2000&odnBg=ffffff",
    store: "Walmart",
		category: "Bakery & Grains",
    description: "Classic white bread loaf.",
    inStock: true,
  },
  {
    id: "apple_instacart",
    name: "Organic Fuji Apple",
    price: 1.29,
    image: "https://d2d8wwwkmhfcva.cloudfront.net/800x/filters:fill(FFF,true):format(jpg)/d2lniltooz52yy.cloudfront.net/item_detail/picture18/092265a8afca459689a763c5942c7150-1620844026.jpg",
    store: "Instacart",
		category: "Fruits",
    description: "Organic Fuji Apple.",
    inStock: true,
  },
  {
    id: "banana_instacart",
    name: "Organic Banana",
    price: 0.79,
    image: "https://d2d8wwwkmhfcva.cloudfront.net/800x/filters:fill(FFF,true):format(jpg)/d2lniltooz52yy.cloudfront.net/item_detail/picture18/264534ea299c4d99bc94599c98f6fa08-1633719833.jpg",
    store: "Instacart",
		category: "Fruits",
    description: "Organic Banana.",
    inStock: true,
  },
  {
    id: "bread_instacart",
    name: "Dave's Killer Bread Organic Good Seed",
    price: 5.99,
    image: "https://d2d8wwwkmhfcva.cloudfront.net/800x/filters:fill(FFF,true):format(jpg)/d2lniltooz52yy.cloudfront.net/item_detail/picture18/597f32b3ca5f401aa878ffc185e39199-1620843982.jpg",
    store: "Instacart",
		category: "Bakery & Grains",
    description: "Organic bread with good seeds.",
    inStock: true,
  },
  {
    id: "coffee_walmart",
    name: "Folgers Classic Roast Ground Coffee, 30.5 oz",
    price: 8.48,
    image: "https://i5.walmartimages.com/asr/819eb954-7b71-485f-8e94-153d8c81a334.57a993eadb29d9941f599a74630972f6.jpeg?odnHeight=2000&odnWidth=2000&odnBg=ffffff",
    store: "Walmart",
		category: "Beverages",
    description: "Classic roast ground coffee.",
    inStock: true,
  },
  {
    id: "cereal_walmart",
    name: "Kellogg's Frosted Flakes Breakfast Cereal, 24 oz",
    price: 3.64,
    image: "https://i5.walmartimages.com/asr/9f69c399-3483-4693-a4f1-54847695355f.9356c941ca5cae86abb83415549988a4.jpeg?odnHeight=2000&odnWidth=2000&odnBg=ffffff",
    store: "Walmart",
		category: "Pantry Staples",
    description: "Frosted Flakes breakfast cereal.",
    inStock: true,
  },
  {
    id: "orange_juice_walmart",
    name: "Great Value 100% Orange Juice, 52 fl oz",
    price: 2.50,
    image: "https://i5.walmartimages.com/asr/bca5e314-9a59-4f49-8662-10e5c6239294.034aefc4c7534459799ca9a3c6402367.jpeg?odnHeight=2000&odnWidth=2000&odnBg=ffffff",
    store: "Walmart",
		category: "Beverages",
    description: "100% orange juice.",
    inStock: true,
  },
  {
    id: "coffee_instacart",
    name: "Starbucks Pike Place Roast Ground Coffee",
    price: 11.99,
    image: "https://d2d8wwwkmhfcva.cloudfront.net/800x/filters:fill(FFF,true):format(jpg)/d2lniltooz52yy.cloudfront.net/item_detail/picture18/00011120010079-1575567844.jpg",
    store: "Instacart",
		category: "Beverages",
    description: "Pike Place Roast Ground Coffee.",
    inStock: true,
  },
  {
    id: "cereal_instacart",
    name: "General Mills Cheerios Cereal",
    price: 4.29,
    image: "https://d2d8wwwkmhfcva.cloudfront.net/800x/filters:fill(FFF,true):format(jpg)/d2lniltooz52yy.cloudfront.net/item_detail/picture18/00016000490708-1620844000.jpg",
    store: "Instacart",
		category: "Pantry Staples",
    description: "Cheerios Cereal.",
    inStock: true,
  },
  {
    id: "orange_juice_instacart",
    name: "Simply Orange Juice",
    price: 3.99,
    image: "https://d2d8wwwkmhfcva.cloudfront.net/800x/filters:fill(FFF,true):format(jpg)/d2lniltooz52yy.cloudfront.net/item_detail/picture18/00005200003100-1620843974.jpg",
    store: "Instacart",
		category: "Beverages",
    description: "Simply Orange Juice.",
    inStock: true,
  },
];

const categorizeShoppingItem = async (itemText: string): Promise<ProductCategory> => {
  // Mock implementation: Categorize based on keywords
  const lowerCaseItemText = itemText.toLowerCase();

  if (lowerCaseItemText.includes("milk") || lowerCaseItemText.includes("cheese") || lowerCaseItemText.includes("yogurt") || lowerCaseItemText.includes("butter") || lowerCaseItemText.includes("cream")) {
    return "Dairy & Alternatives";
  } else if (lowerCaseItemText.includes("apple") || lowerCaseItemText.includes("banana") || lowerCaseItemText.includes("orange") || lowerCaseItemText.includes("berries") || lowerCaseItemText.includes("fruit")) {
    return "Fruits";
  } else if (lowerCaseItemText.includes("carrot") || lowerCaseItemText.includes("broccoli") || lowerCaseItemText.includes("spinach") || lowerCaseItemText.includes("tomato") || lowerCaseItemText.includes("vegetable")) {
    return "Vegetables";
  } else if (lowerCaseItemText.includes("chicken") || lowerCaseItemText.includes("beef") || lowerCaseItemText.includes("fish") || lowerCaseItemText.includes("salmon") || lowerCaseItemText.includes("meat")) {
    return "Meat & Seafood";
  } else if (lowerCaseItemText.includes("bread") || lowerCaseItemText.includes("cereal") || lowerCaseItemText.includes("pasta") || lowerCaseItemText.includes("rice") || lowerCaseItemText.includes("grain")) {
    return "Bakery & Grains";
  } else if (lowerCaseItemText.includes("chips") || lowerCaseItemText.includes("chocolate") || lowerCaseItemText.includes("candy") || lowerCaseItemText.includes("cookies") || lowerCaseItemText.includes("snack")) {
    return "Snacks";
  } else if (lowerCaseItemText.includes("coffee") || lowerCaseItemText.includes("tea") || lowerCaseItemText.includes("juice") || lowerCaseItemText.includes("soda") || lowerCaseItemText.includes("beverage")) {
    return "Beverages";
  } else if (lowerCaseItemText.includes("salt") || lowerCaseItemText.includes("pepper") || lowerCaseItemText.includes("sauce") || lowerCaseItemText.includes("spice")) {
    return "Condiments & Spices";
  } else if (lowerCaseItemText.includes("ice cream") || lowerCaseItemText.includes("pizza") || lowerCaseItemText.includes("peas")) {
    return "Frozen Foods";
  } else if (lowerCaseItemText.includes("flour") || lowerCaseItemText.includes("sugar") || lowerCaseItemText.includes("oil")) {
    return "Pantry Staples";
  } else if (lowerCaseItemText.includes("shampoo") || lowerCaseItemText.includes("soap") || lowerCaseItemText.includes("toothpaste")) {
    return "Personal Care";
  } else if (lowerCaseItemText.includes("cleaner") || lowerCaseItemText.includes("detergent") || lowerCaseItemText.includes("paper towels")) {
    return "Household";
  } else if (lowerCaseItemText.includes("diapers") || lowerCaseItemText.includes("formula") || lowerCaseItemText.includes("wipes")) {
    return "Baby & Child Care";
  } else if (lowerCaseItemText.includes("dog food") || lowerCaseItemText.includes("cat food") || lowerCaseItemText.includes("pet toy")) {
    return "Pet Care";
  } else if (lowerCaseItemText.includes("vitamins") || lowerCaseItemText.includes("supplements")) {
    return "Health & Wellness";
  }

  return "Uncategorized";
};

const findMatchingProducts = async (itemText: string, category: ProductCategory): Promise<Product[]> => {
  // Mock implementation: Find products based on keywords and category
  const lowerCaseItemText = itemText.toLowerCase();
  
  const matchingProducts = mockProducts.filter(product => {
    const lowerCaseProductName = product.name.toLowerCase();
    return lowerCaseProductName.includes(lowerCaseItemText) && product.category === category;
  });
  
  return matchingProducts;
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
        
        // Toast error here but use imported toast
        toast({
          title: "Error",
          description: `Failed to process "${itemText}". Please try again.`,
          variant: "destructive"
        });
      }
    }
    
    return items;
  } catch (error) {
    console.error("Error processing shopping list:", error);
    // Toast error here but use imported toast
    toast({
      title: "Error",
      description: "Failed to process shopping list. Please try again.",
      variant: "destructive"
    });
    return items;
  }
};

export const checkoutCart = async (items: ShoppingListItem[]) => {
  // Mock implementation: Just log the items
  console.log("Checking out cart with items:", items);
  
  // You would typically integrate with a payment gateway here
  
  return { success: true };
};
