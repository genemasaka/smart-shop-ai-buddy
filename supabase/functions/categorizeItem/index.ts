
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/masakaeugene/grocery-classifier";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the item from the request body
    const { item } = await req.json();
    
    if (!item || typeof item !== 'string') {
      return new Response(
        JSON.stringify({ error: "Item is required and must be a string" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Categorizing item: ${item}`);

    // Get the Hugging Face API token from environment variables
    const huggingfaceToken = Deno.env.get("HUGGINGFACE_TOKEN") || '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';
    
    // Call the Hugging Face API
    const response = await fetch(HUGGINGFACE_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${huggingfaceToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: item }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Hugging Face API error:", error);
      
      return new Response(
        JSON.stringify({ error: `Hugging Face API error: ${response.status}` }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse the API response
    const data = await response.json();
    console.log("Hugging Face API response:", JSON.stringify(data));

    // Extract the category with the highest score
    let category = "Uncategorized";
    let highestScore = 0;

    if (Array.isArray(data) && data.length > 0) {
      data.forEach((result) => {
        if (result.score > highestScore) {
          highestScore = result.score;
          category = result.label;
        }
      });
    }

    // Return the predicted category
    return new Response(
      JSON.stringify({ 
        category, 
        confidence: highestScore,
        rawResponse: data 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ error: "Failed to process item" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
