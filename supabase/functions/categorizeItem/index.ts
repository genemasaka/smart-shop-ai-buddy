
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Parse the request body
    const requestData = await req.json()
    const text = requestData.text

    // Validate input
    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid input. "text" field is required and must be a string.' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Simple categorization logic - for demonstration, in reality you would use an AI model here
    // This is a fallback to ensure the endpoint works even without Hugging Face
    let category = "Uncategorized"
    
    const textLower = text.toLowerCase()
    
    if (textLower.includes("milk") || textLower.includes("cheese") || textLower.includes("yogurt")) {
      category = "Dairy"
    } else if (textLower.includes("apple") || textLower.includes("banana") || textLower.includes("vegetable")) {
      category = "Produce"
    } else if (textLower.includes("detergent") || textLower.includes("soap") || textLower.includes("cleaner")) {
      category = "Cleaning Supplies"
    } else if (textLower.includes("pasta") || textLower.includes("rice") || textLower.includes("cereal")) {
      category = "Pantry"
    } else if (textLower.includes("coffee") || textLower.includes("tea") || textLower.includes("juice")) {
      category = "Beverages"
    } else if (textLower.includes("shampoo") || textLower.includes("toothpaste")) {
      category = "Health and Beauty"
    } else if (textLower.includes("towels") || textLower.includes("trash bags")) {
      category = "Household"
    } else if (textLower.includes("laptop") || textLower.includes("phone")) {
      category = "Electronics"
    }

    return new Response(
      JSON.stringify({ category }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Server error processing request',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
