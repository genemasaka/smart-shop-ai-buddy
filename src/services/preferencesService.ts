
import { supabase } from "@/integrations/supabase/client";
import { UserPreferences } from "@/components/settings/PreferencesForm";

export const fetchUserPreferences = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error("Error fetching user preferences:", error);
    return null;
  }

  if (!data) return null;
  
  // Map from database format (snake_case) to component format (camelCase)
  return {
    preferredStore: data.preferred_store as UserPreferences["preferredStore"],
    dietaryRestrictions: {
      organic: data.organic || false,
      glutenFree: data.gluten_free || false,
      dairyFree: data.dairy_free || false,
      vegan: data.vegan || false,
    },
    pricePreference: data.price_preference as UserPreferences["pricePreference"],
  } as UserPreferences;
};

export const saveUserPreferences = async (userId: string, preferences: UserPreferences) => {
  const { error } = await supabase
    .from('user_preferences')
    .upsert({
      id: userId,
      preferred_store: preferences.preferredStore,
      organic: preferences.dietaryRestrictions.organic,
      gluten_free: preferences.dietaryRestrictions.glutenFree,
      dairy_free: preferences.dietaryRestrictions.dairyFree,
      vegan: preferences.dietaryRestrictions.vegan,
      price_preference: preferences.pricePreference
    }, {
      onConflict: 'id'
    });

  if (error) {
    console.error("Error saving user preferences:", error);
    throw error;
  }
  
  return true;
};
