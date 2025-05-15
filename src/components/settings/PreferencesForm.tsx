
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserPreferences, saveUserPreferences } from "@/services/preferencesService";

export interface UserPreferences {
  preferredStore: "Walmart" | "Instacart" | "No Preference";
  dietaryRestrictions: {
    organic: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
    vegan: boolean;
  };
  pricePreference: "lowest" | "mid-range" | "premium";
}

interface PreferencesFormProps {
  preferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
}

export function PreferencesForm({ preferences: initialPreferences, onSave }: PreferencesFormProps) {
  const [preferences, setPreferences] = useState<UserPreferences>(initialPreferences);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your preferences.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      await saveUserPreferences(user.id, preferences);
      
      onSave(preferences);
      toast({
        title: "Preferences saved",
        description: "Your shopping preferences have been updated.",
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Failed to save preferences",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Shopping Preferences</CardTitle>
          <CardDescription>
            Customize your shopping experience to get better product recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preferred Store */}
          <div className="space-y-2">
            <Label htmlFor="preferred-store">Preferred Store</Label>
            <RadioGroup 
              id="preferred-store" 
              value={preferences.preferredStore}
              onValueChange={(value) => 
                setPreferences({
                  ...preferences,
                  preferredStore: value as UserPreferences["preferredStore"]
                })
              }
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Walmart" id="walmart" />
                <Label htmlFor="walmart">Walmart</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Instacart" id="instacart" />
                <Label htmlFor="instacart">Instacart</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No Preference" id="no-preference" />
                <Label htmlFor="no-preference">No Preference</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Dietary Restrictions */}
          <div className="space-y-3">
            <Label>Dietary Restrictions</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="organic" className="cursor-pointer">Organic Products</Label>
                <Switch
                  id="organic"
                  checked={preferences.dietaryRestrictions.organic}
                  onCheckedChange={(checked) =>
                    setPreferences({
                      ...preferences,
                      dietaryRestrictions: {
                        ...preferences.dietaryRestrictions,
                        organic: checked,
                      },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="gluten-free" className="cursor-pointer">Gluten Free</Label>
                <Switch
                  id="gluten-free"
                  checked={preferences.dietaryRestrictions.glutenFree}
                  onCheckedChange={(checked) =>
                    setPreferences({
                      ...preferences,
                      dietaryRestrictions: {
                        ...preferences.dietaryRestrictions,
                        glutenFree: checked,
                      },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="dairy-free" className="cursor-pointer">Dairy Free</Label>
                <Switch
                  id="dairy-free"
                  checked={preferences.dietaryRestrictions.dairyFree}
                  onCheckedChange={(checked) =>
                    setPreferences({
                      ...preferences,
                      dietaryRestrictions: {
                        ...preferences.dietaryRestrictions,
                        dairyFree: checked,
                      },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="vegan" className="cursor-pointer">Vegan</Label>
                <Switch
                  id="vegan"
                  checked={preferences.dietaryRestrictions.vegan}
                  onCheckedChange={(checked) =>
                    setPreferences({
                      ...preferences,
                      dietaryRestrictions: {
                        ...preferences.dietaryRestrictions,
                        vegan: checked,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>
          
          {/* Price Preference */}
          <div className="space-y-2">
            <Label htmlFor="price-preference">Price Preference</Label>
            <Select 
              value={preferences.pricePreference}
              onValueChange={(value) =>
                setPreferences({
                  ...preferences,
                  pricePreference: value as UserPreferences["pricePreference"]
                })
              }
            >
              <SelectTrigger id="price-preference">
                <SelectValue placeholder="Select price range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lowest">Lowest Price (Budget options)</SelectItem>
                <SelectItem value="mid-range">Mid-Range (Best value)</SelectItem>
                <SelectItem value="premium">Premium (Highest quality)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Preferences"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
