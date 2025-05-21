
import { toast } from "sonner";
import { ProductCategory } from "./productService";

const API_URL = "https://api-inference.huggingface.co/models/masakaeugene/grocery-classifier";

// Store the API key in a constant
// In a production app, this should be stored in environment variables
// For this demo, we'll hardcode it for simplicity
let API_TOKEN = ""; // To be set by the user

export const setHuggingFaceApiToken = (token: string) => {
  API_TOKEN = token;
  // Store in localStorage for persistence
  localStorage.setItem("huggingface_token", token);
};

export const getHuggingFaceApiToken = (): string => {
  if (!API_TOKEN) {
    // Try to get from localStorage
    const storedToken = localStorage.getItem("huggingface_token");
    if (storedToken) {
      API_TOKEN = storedToken;
    }
  }
  return API_TOKEN;
};

// Map Hugging Face model output categories to our app's categories
const mapCategoryFromModel = (modelCategory: string): ProductCategory => {
  // Normalize the category string
  const normalizedCategory = modelCategory.toLowerCase().trim();
  
  // Map model categories to our app's categories
  const categoryMap: Record<string, ProductCategory> = {
    "dairy": "Dairy",
    "milk": "Dairy",
    "cheese": "Dairy",
    "yogurt": "Dairy",
    "produce": "Produce",
    "fruit": "Produce",
    "vegetable": "Produce",
    "cleaning": "Cleaning Supplies",
    "cleaner": "Cleaning Supplies",
    "detergent": "Cleaning Supplies",
    "pantry": "Pantry",
    "canned": "Pantry",
    "pasta": "Pantry",
    "rice": "Pantry",
    "beverage": "Beverages",
    "drink": "Beverages",
    "health": "Health and Beauty",
    "beauty": "Health and Beauty",
    "personal care": "Health and Beauty",
    "household": "Household",
    "paper": "Household",
    "electronics": "Electronics",
    "gadget": "Electronics",
    "device": "Electronics"
  };
  
  // Find the best match
  for (const [key, value] of Object.entries(categoryMap)) {
    if (normalizedCategory.includes(key)) {
      return value;
    }
  }
  
  // Default fallback
  return "Uncategorized";
};

// Classify text using the Hugging Face API
export const classifyGroceryItem = async (text: string): Promise<ProductCategory> => {
  try {
    const token = getHuggingFaceApiToken();
    
    if (!token) {
      console.warn("Hugging Face API token not set, using fallback classification");
      toast("API token not set. Using basic classification instead.");
      throw new Error("API token not set");
    }
    
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: text })
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error("Hugging Face API error:", error);
      throw new Error(`API error: ${response.status}`);
    }
    
    const result = await response.json();
    
    // The API returns an array of label/score pairs
    if (Array.isArray(result) && result.length > 0) {
      // Get the label with the highest score
      const topPrediction = result[0];
      // Map the model's category to our app's category system
      return mapCategoryFromModel(topPrediction.label);
    }
    
    throw new Error("Unexpected response format");
  } catch (error) {
    console.error("Error classifying item with Hugging Face:", error);
    // Fallback to the simpler classification method
    return fallbackCategorization(text);
  }
};

// Fallback categorization function (copy of the original categorizeShoppingItem logic)
const fallbackCategorization = (text: string): ProductCategory => {
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
