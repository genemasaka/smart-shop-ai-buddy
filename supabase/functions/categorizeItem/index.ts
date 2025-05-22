
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

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

    let category = "Uncategorized"
    
    try {
      // Initialize Hugging Face with the token from environment variables
      const hf = new HfInference(Deno.env.get("HUGGINGFACE_TOKEN"))
      
      // Create a proper prompt for the classification task
      const prompt = `
        Categorize this grocery item into one of these categories:
        Dairy, Produce, Cleaning Supplies, Pantry, Beverages, Health and Beauty, Household, Electronics, or Uncategorized.
        
        Item: ${text}
        
        Category:
      `
      
      // Call Hugging Face for classification
      const response = await hf.textGeneration({
        model: "google/flan-t5-large",
        inputs: prompt,
        parameters: {
          max_length: 32,
          temperature: 0.1,
        },
      })
      
      // Extract the category from the response
      if (response && response.generated_text) {
        // Clean up the response
        const generatedText = response.generated_text.trim()
        
        // Check if the response is one of our valid categories
        const validCategories = ["Dairy", "Produce", "Cleaning Supplies", "Pantry", "Beverages", 
                                "Health and Beauty", "Household", "Electronics", "Uncategorized"]
        
        // Find a matching category in the response
        for (const validCategory of validCategories) {
          if (generatedText.includes(validCategory)) {
            category = validCategory
            break
          }
        }
      }
      
      console.log(`Hugging Face categorized "${text}" as "${category}"`)
      
    } catch (hfError) {
      // Log the error but continue with the default category
      console.error('Error using Hugging Face for categorization:', hfError)
      category = "Uncategorized"
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
