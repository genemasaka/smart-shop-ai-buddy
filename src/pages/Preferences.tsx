
import { useState, useEffect } from "react";
import { PreferencesForm, UserPreferences } from "@/components/settings/PreferencesForm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { fetchUserPreferences, saveUserPreferences } from "@/services/preferencesService";
import { Loader2 } from "lucide-react";

const Preferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    preferredStore: "No Preference",
    dietaryRestrictions: {
      organic: false,
      glutenFree: false,
      dairyFree: false,
      vegan: false,
    },
    pricePreference: "mid-range",
  });
  
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const userPrefs = await fetchUserPreferences(user.id);
        
        if (userPrefs) {
          // Map from database format to component format
          setPreferences({
            preferredStore: userPrefs.preferred_store as UserPreferences["preferredStore"],
            dietaryRestrictions: {
              organic: userPrefs.organic || false,
              glutenFree: userPrefs.gluten_free || false,
              dairyFree: userPrefs.dairy_free || false,
              vegan: userPrefs.vegan || false,
            },
            pricePreference: userPrefs.price_preference as UserPreferences["pricePreference"],
          });
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
        toast({
          title: "Failed to load preferences",
          description: "We couldn't load your saved preferences.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user, toast]);

  const handleSavePreferences = async (newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
    
    if (user) {
      try {
        await saveUserPreferences(user.id, newPreferences);
      } catch (error) {
        console.error("Error saving preferences:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-1">Preferences</h1>
        <p className="text-muted-foreground mb-6">
          Customize your shopping experience
        </p>
        
        <PreferencesForm 
          preferences={preferences}
          onSave={handleSavePreferences}
        />
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <h3 className="font-medium">Connected Accounts</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your store accounts for faster checkout
                </p>
              </div>
              <Button variant="outline">Connect</Button>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <h3 className="font-medium">Notification Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Manage how we contact you
                </p>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="font-medium">Delete Account</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and data
                </p>
              </div>
              <Button variant="destructive">Delete</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
