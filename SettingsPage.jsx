import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Save, Palette, UserCog, CloudCog, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsPage = () => {
  const { toast } = useToast();
  const [userSettings, setUserSettings] = useState({
    username: 'HydroUser',
    email: 'user@example.com',
    darkMode: false,
    dataSyncInterval: 'daily',
  });
  const [appVersion] = useState('1.0.0'); // Example app version

  useEffect(() => {
    const storedSettings = JSON.parse(localStorage.getItem('app_settings'));
    if (storedSettings) {
      setUserSettings(prev => ({ ...prev, ...storedSettings }));
    }
    // Apply dark mode if it was set
    if (storedSettings?.darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleInputChange = (key, value) => {
    setUserSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleToggleDarkMode = (checked) => {
    setUserSettings(prev => ({ ...prev, darkMode: checked }));
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSaveSettings = () => {
    localStorage.setItem('app_settings', JSON.stringify(userSettings));
    toast({
      title: "Settings Saved! ✨",
      description: "Your preferences have been updated.",
    });
  };
  
  const handleClearLocalStorage = () => {
    if (window.confirm("Are you sure you want to clear all application data? This action cannot be undone.")) {
      localStorage.clear();
      toast({
        title: "Data Cleared! 🗑️",
        description: "All local application data has been removed. Please refresh the page.",
        variant: "destructive"
      });
      // Optionally, force a reload or redirect to re-initialize the app state
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  const handleNotImplemented = (feature) => {
     toast({
      title: `🚧 ${feature} Not Implemented`,
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Application Settings</CardTitle>
          <CardDescription>Customize your HydroPonic Manager experience.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary flex items-center"><UserCog className="mr-2" />User Profile (Placeholder)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/30">
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={userSettings.username} onChange={(e) => handleInputChange('username', e.target.value)} disabled />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={userSettings.email} onChange={(e) => handleInputChange('email', e.target.value)} disabled />
              </div>
            </div>
             <Button variant="outline" className="mt-2" onClick={() => handleNotImplemented("User Profile Editing")}>Edit Profile</Button>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary flex items-center"><Palette className="mr-2" />Appearance</h3>
            <div className="p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode-switch" className="text-base">Enable Dark Mode</Label>
                <Switch
                  id="dark-mode-switch"
                  checked={userSettings.darkMode}
                  onCheckedChange={handleToggleDarkMode}
                />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary flex items-center"><CloudCog className="mr-2" />Data & Sync (Placeholder)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/30">
              <div className="space-y-1">
                <Label htmlFor="data-sync-interval">Data Sync Interval</Label>
                <Select 
                  value={userSettings.dataSyncInterval} 
                  onValueChange={(value) => handleInputChange('dataSyncInterval', value)}
                  disabled
                >
                  <SelectTrigger id="data-sync-interval">
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="manual">Manual Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="outline" className="w-full" onClick={() => handleNotImplemented("Manual Sync")} disabled>Sync Data Now</Button>
              </div>
            </div>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-3 text-destructive flex items-center"><Trash2 className="mr-2" />Danger Zone</h3>
            <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/10">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div>
                  <p className="font-medium text-destructive-foreground">Clear All Local Data</p>
                  <p className="text-sm text-destructive-foreground/80">This will remove all plants, logs, and settings from your browser. This action cannot be undone.</p>
                </div>
                <Button variant="destructive" onClick={handleClearLocalStorage} className="mt-2 sm:mt-0">
                  Clear Data
                </Button>
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSaveSettings}>
              <Save className="w-4 h-4 mr-2" /> Save All Settings
            </Button>
          </div>
          
          <div className="text-center text-xs text-muted-foreground pt-4 border-t">
            App Version: {appVersion}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SettingsPage;