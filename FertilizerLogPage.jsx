import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { formatDate } from '@/lib/utils';
import { Leaf, PlusCircle, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const FertilizerLogPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const queryParams = new URLSearchParams(location.search);
  const preselectedPlantId = queryParams.get('plantId');

  const [plants, setPlants] = useState([]);
  const [selectedPlantId, setSelectedPlantId] = useState(preselectedPlantId || '');
  const [fertilizerName, setFertilizerName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [applicationDate, setApplicationDate] = useState(new Date().toISOString().split('T')[0]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const storedPlants = JSON.parse(localStorage.getItem('hydroponic_plants')) || [];
    setPlants(storedPlants);
    if (storedPlants.length > 0 && !preselectedPlantId) {
      setSelectedPlantId(storedPlants[0].id);
    } else if (preselectedPlantId) {
      setSelectedPlantId(preselectedPlantId);
    }
  }, [preselectedPlantId]);

  useEffect(() => {
    if (selectedPlantId) {
      const storedLogs = JSON.parse(localStorage.getItem(`fertilizer_logs_${selectedPlantId}`)) || [];
      setLogs(storedLogs);
    } else {
      setLogs([]);
    }
  }, [selectedPlantId]);

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!selectedPlantId || !fertilizerName || !quantity || !applicationDate) {
      toast({ title: "Missing Fields", description: "Please fill all fields.", variant: "destructive" });
      return;
    }
    const newLog = { id: Date.now().toString(), fertilizerName, quantity, applicationDate };
    const updatedLogs = [...logs, newLog];
    setLogs(updatedLogs);
    localStorage.setItem(`fertilizer_logs_${selectedPlantId}`, JSON.stringify(updatedLogs));
    
    const currentPlant = plants.find(p => p.id === selectedPlantId);
    const updatedPlants = plants.map(p => 
      p.id === selectedPlantId 
        ? {...p, fertilizerStatus: `Applied ${fertilizerName} on ${formatDate(applicationDate)}`} 
        : p
    );
    localStorage.setItem('hydroponic_plants', JSON.stringify(updatedPlants));
    setPlants(updatedPlants);

    toast({ title: "Fertilizer Log Added", description: `${fertilizerName} applied to ${currentPlant?.name}.` });
    setFertilizerName('');
    setQuantity('');
  };

  const handleDeleteLog = (logId) => {
    const updatedLogs = logs.filter(log => log.id !== logId);
    setLogs(updatedLogs);
    localStorage.setItem(`fertilizer_logs_${selectedPlantId}`, JSON.stringify(updatedLogs));
    toast({ title: "Log Entry Deleted", variant: "destructive" });
  };
  
  const selectedPlant = plants.find(p => p.id === selectedPlantId);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-6 space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Fertilizer Log</CardTitle>
          <CardDescription>Track fertilizer applications for your plants.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddLog} className="space-y-4 mb-6 p-4 border rounded-lg bg-muted/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="space-y-1">
                <Label htmlFor="plant-select">Select Plant</Label>
                <Select value={selectedPlantId} onValueChange={setSelectedPlantId} required>
                  <SelectTrigger id="plant-select">
                    <SelectValue placeholder="Choose a plant" />
                  </SelectTrigger>
                  <SelectContent>
                    {plants.map(plant => (
                      <SelectItem key={plant.id} value={plant.id}>{plant.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="fertilizer-name">Fertilizer Name</Label>
                <Input id="fertilizer-name" value={fertilizerName} onChange={e => setFertilizerName(e.target.value)} placeholder="e.g., Grow Big" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="quantity">Quantity (e.g., 5ml/L)</Label>
                <Input id="quantity" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="e.g., 5ml/L" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="application-date">Application Date</Label>
                <Input id="application-date" type="date" value={applicationDate} onChange={e => setApplicationDate(e.target.value)} required />
              </div>
            </div>
            <Button type="submit" className="w-full sm:w-auto">
              <PlusCircle className="w-4 h-4 mr-2" /> Add Log Entry
            </Button>
          </form>

          {selectedPlant && (
            <h3 className="text-lg md:text-xl font-semibold mb-2 text-primary">
              History for: {selectedPlant.name}
            </h3>
          )}
          {logs.length > 0 ? (
            <Card className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Fertilizer</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.sort((a,b) => new Date(b.applicationDate) - new Date(a.applicationDate)).map(log => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">{formatDate(log.applicationDate)}</TableCell>
                      <TableCell>{log.fertilizerName}</TableCell>
                      <TableCell>{log.quantity}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteLog(log.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Leaf className="w-12 h-12 mx-auto mb-2 opacity-50" />
              No fertilizer logs for {selectedPlant ? selectedPlant.name : "the selected plant"} yet.
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FertilizerLogPage;