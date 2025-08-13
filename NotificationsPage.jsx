import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { BellRing, Droplets, Leaf, CalendarClock } from 'lucide-react';
import { motion } from 'framer-motion';

const NotificationsPage = () => {
  const { toast } = useToast();
  const [notificationSettings, setNotificationSettings] = useState({
    irrigation: true,
    transplant: true,
    fertilization: false,
    lowWater: true,
    phAlert: false,
  });

  useEffect(() => {
    const storedSettings = JSON.parse(localStorage.getItem('notification_settings'));
    if (storedSettings) {
      setNotificationSettings(storedSettings);
    }
  }, []);

  const handleSettingChange = (key, value) => {
    const updatedSettings = { ...notificationSettings, [key]: value };
    setNotificationSettings(updatedSettings);
    localStorage.setItem('notification_settings', JSON.stringify(updatedSettings));
    toast({
      title: "Settings Updated",
      description: `Notifications for ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}.`,
    });
  };

  const notificationItems = [
    { id: 'irrigation', label: 'Irrigation Reminders', icon: <Droplets className="w-5 h-5 text-blue-500" /> },
    { id: 'transplant', label: 'Transplant Due Dates', icon: <CalendarClock className="w-5 h-5 text-green-500" /> },
    { id: 'fertilization', label: 'Fertilization Schedule', icon: <Leaf className="w-5 h-5 text-yellow-600" /> },
    { id: 'lowWater', label: 'Low Water Level Alerts', icon: <BellRing className="w-5 h-5 text-red-500" /> },
    { id: 'phAlert', label: 'pH Out-of-Range Alerts', icon: <BellRing className="w-5 h-5 text-purple-500" /> },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Notification Settings</CardTitle>
          <CardDescription>Manage your alert preferences for system events.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {notificationItems.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-3">
                {item.icon}
                <Label htmlFor={item.id} className="text-base cursor-pointer">{item.label}</Label>
              </div>
              <Switch
                id={item.id}
                checked={notificationSettings[item.id]}
                onCheckedChange={(value) => handleSettingChange(item.id, value)}
              />
            </div>
          ))}
          <div className="pt-4 text-center">
            <Button onClick={() => toast({ title: "🚧 Test Notification", description: "This is a sample alert!" })}>
              Send Test Notification
            </Button>
            <p className="text-xs text-muted-foreground mt-2">Note: Actual push notifications require further setup (e.g., service workers, backend).</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NotificationsPage;