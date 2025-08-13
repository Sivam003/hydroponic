import React from 'react';
import { Bell, UserCircle, Cloud, CloudOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const Header = ({ pageTitle }) => {
  const { toast } = useToast();
  const [cloudSync, setCloudSync] = React.useState(false);

  const handleCloudSyncToggle = () => {
    setCloudSync(!cloudSync);
    toast({
      title: "Cloud Sync ☁️",
      description: `Cloud sync ${!cloudSync ? 'enabled' : 'disabled'}. This feature is a placeholder.`,
    });
  };
  
  const handleAuthClick = () => {
    toast({
      title: "Authentication 🚧",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="bg-card text-card-foreground p-4 border-b border-border flex justify-between items-center shadow-sm"
    >
      <h1 className="text-xl font-semibold text-primary">{pageTitle || "Dashboard"}</h1>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {cloudSync ? <Cloud className="text-primary" /> : <CloudOff className="text-muted-foreground" />}
          <Label htmlFor="cloud-sync-toggle" className="text-sm text-muted-foreground">Cloud Sync</Label>
          <Switch id="cloud-sync-toggle" checked={cloudSync} onCheckedChange={handleCloudSyncToggle} />
        </div>
        <Button variant="ghost" size="icon" onClick={() => toast({ title: "🚧 Feature not implemented", description: "Notifications aren't set up yet."})}>
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleAuthClick}>
          <UserCircle className="w-6 h-6" />
        </Button>
      </div>
    </motion.header>
  );
};

export default Header;