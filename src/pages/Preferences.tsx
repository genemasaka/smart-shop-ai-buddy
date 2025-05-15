
import { useState } from "react";
import { PreferencesForm, UserPreferences } from "@/components/settings/PreferencesForm";
import { Button } from "@/components/ui/button";

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

  const handleSavePreferences = (newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
    // In a real app, this would save to the user's profile in the backend
  };

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
