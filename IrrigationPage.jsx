import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Droplets, Clock, Settings2, WifiOff, Thermometer, Zap as ZapIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const IrrigationPage = () => {
  const { toast } = useToast();
  const [plants, setPlants] = useState([]);
  const [selectedPlantId, setSelectedPlantId] = useState('');
  const [autoIrrigationEnabled, setAutoIrrigationEnabled] = useState(false);
  const [irrigationTimes, setIrrigationTimes] = useState(['08:00', '14:00', '20:00']);

  useEffect(() => {
    const storedPlants = JSON.parse(localStorage.getItem('hydroponic_plants')) || [];
    setPlants(storedPlants);
    if (storedPlants.length > 0) {
      setSelectedPlantId(storedPlants[0].id);
    }
    const storedSettings = JSON.parse(localStorage.getItem('irrigation_settings'));
    if (storedSettings) {
      setAutoIrrigationEnabled(storedSettings.autoIrrigationEnabled || false);
      setIrrigationTimes(storedSettings.irrigationTimes || ['08:00', '14:00', '20:00']);
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem('irrigation_settings', JSON.stringify({ autoIrrigationEnabled, irrigationTimes }));
  };

  const handleManualIrrigate = () => {
    if (!selectedPlantId) {
      toast({ title: "No Plant Selected", description: "Please select a plant to irrigate.", variant: "destructive" });
      return;
    }
    const plant = plants.find(p => p.id === selectedPlantId);
    const updatedPlants = plants.map(p => p.id === selectedPlantId ? {...p, lastIrrigated: new Date().toISOString()} : p);
    localStorage.setItem('hydroponic_plants', JSON.stringify(updatedPlants));
    setPlants(updatedPlants); // Update local state to reflect change immediately if needed elsewhere

    toast({
      title: `Irrigating ${plant?.name || 'Plant'}! 💧`,
      description: "Manual irrigation initiated. (This is a simulation)",
    });
  };

  const handleTimeChange = (index, value) => {
    const newTimes = [...irrigationTimes];
    newTimes[index] = value;
    setIrrigationTimes(newTimes);
    saveSettings();
  };

  const handleToggleAutoIrrigation = (checked) => {
    setAutoIrrigationEnabled(checked);
    saveSettings();
    toast({
      title: `Auto Irrigation ${checked ? 'Enabled' : 'Disabled'}`,
      description: checked ? "System will attempt to irrigate at scheduled times." : "Automatic irrigation is now off.",
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
          <CardTitle className="text-2xl">Irrigation Control Panel</CardTitle>
          <CardDescription>Manage manual and automated irrigation for your plants.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <section>
            <h3 className="text-lg font-semibold mb-2 text-primary flex items-center"><Droplets className="mr-2" />Manual Irrigation</h3>
            <div className="flex flex-col sm:flex-row gap-4 items-end p-4 border rounded-lg bg-muted/30">
              <div className="flex-grow space-y-1">
                <Label htmlFor="plant-select-manual">Select Plant</Label>
                <Select value={selectedPlantId} onValueChange={setSelectedPlantId}>
                  <SelectTrigger id="plant-select-manual">
                    <SelectValue placeholder="Choose a plant" />
                  </SelectTrigger>
                  <SelectContent>
                    {plants.map(plant => (
                      <SelectItem key={plant.id} value={plant.id}>{plant.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleManualIrrigate} className="w-full sm:w-auto">
                <Droplets className="w-4 h-4 mr-2" /> Irrigate Now
              </Button>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2 text-primary flex items-center"><Clock className="mr-2" />Automated Irrigation Scheduler</h3>
            <div className="p-4 border rounded-lg bg-muted/30 space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-irrigation-switch" className="text-base">Enable Auto Irrigation</Label>
                <Switch
                  id="auto-irrigation-switch"
                  checked={autoIrrigationEnabled}
                  onCheckedChange={handleToggleAutoIrrigation}
                />
              </div>
              {autoIrrigationEnabled && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Set up to 3 daily irrigation times:</p>
                  {irrigationTimes.map((time, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Label htmlFor={`irrigation-time-${index}`} className="min-w-[60px]">Time {index + 1}:</Label>
                      <Input
                        id={`irrigation-time-${index}`}
                        type="time"
                        value={time}
                        onChange={(e) => handleTimeChange(index, e.target.value)}
                        className="w-full max-w-[150px]"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-2 text-primary flex items-center"><Settings2 className="mr-2" />Sensor Status (Placeholders)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/30">
              {[
                { label: "Moisture Level", value: "75%", icon: <Droplets className="text-blue-500" /> },
                { label: "pH Level", value: "6.5", icon: <ZapIcon className="text-yellow-500" /> },
                { label: "Water Level", value: "High", icon: <WifiOff className="text-red-500" /> },
                { label: "Temperature", value: "22°C", icon: <Thermometer className="text-orange-500" /> },
                { label: "EC Value", value: "1.5 mS/cm", icon: <ZapIcon className="text-purple-500" /> },
              ].map(sensor => (
                <Card key={sensor.label} className="bg-background/70">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">{sensor.label}</span>
                      {React.cloneElement(sensor.icon, { className: `${sensor.icon.props.className} h-5 w-5`})}
                    </div>
                    <p className="text-2xl font-bold">{sensor.value}</p>
                    {sensor.label === "Water Level" && sensor.value === "High" && <p className="text-xs text-green-600">Tank Full</p>}
                    {sensor.label === "Water Level" && sensor.value !== "High" && <p className="text-xs text-red-600">Check Connection/Sensor</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Note: Sensor data is for demonstration and not connected to real hardware.</p>
          </section>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default IrrigationPage;