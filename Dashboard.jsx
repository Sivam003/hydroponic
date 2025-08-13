import React, { useState, useEffect } from 'react';
import PlantCard from '@/components/PlantCard';
import { Button } from '@/components/ui/button';
import { PlusCircle, Droplets, Zap, Eye, Leaf } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AddPlantForm from '@/components/AddPlantForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

const Dashboard = () => {
  const [plants, setPlants] = useState([]);
  const [isAddPlantDialogOpen, setIsAddPlantDialogOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const storedPlants = JSON.parse(localStorage.getItem('hydroponic_plants')) || [];
    setPlants(storedPlants.map(p => ({...p, photo: p.photo || null}))); // Ensure photo is null if undefined
  }, []);

  const savePlantsToLocalStorage = (updatedPlants) => {
    localStorage.setItem('hydroponic_plants', JSON.stringify(updatedPlants));
    setPlants(updatedPlants.map(p => ({...p, photo: p.photo || null})));
  };

  const handleAddPlant = (newPlantData) => {
    const plantExists = plants.find(p => p.name.toLowerCase() === newPlantData.name.toLowerCase());
    if (plantExists && (!editingPlant || editingPlant.id !== plantExists.id)) {
      toast({
        title: "Plant Exists",
        description: `A plant with the name "${newPlantData.name}" already exists.`,
        variant: "destructive",
      });
      return;
    }

    if (editingPlant) {
      const updatedPlants = plants.map(p => p.id === editingPlant.id ? { ...p, ...newPlantData, photo: newPlantData.photo || p.photo } : p);
      savePlantsToLocalStorage(updatedPlants);
      toast({ title: "Plant Updated! 🌱", description: `${newPlantData.name} has been updated.` });
      setEditingPlant(null);
    } else {
      const newPlant = { 
        id: Date.now().toString(), 
        ...newPlantData,
        photo: newPlantData.photo || null, // Ensure photo is part of new plant data
        lastIrrigated: null, 
        fertilizerStatus: 'Nominal',
      };
      savePlantsToLocalStorage([...plants, newPlant]);
      toast({ title: "Plant Added! 🌿", description: `${newPlant.name} is now growing in your system.` });
    }
    setIsAddPlantDialogOpen(false);
  };
  
  const handleEditPlant = (plant) => {
    setEditingPlant(plant);
    setIsAddPlantDialogOpen(true);
  };

  const handleDeletePlant = (plantId) => {
    const plantToDelete = plants.find(p => p.id === plantId);
    if (window.confirm(`Are you sure you want to delete ${plantToDelete?.name || 'this plant'}?`)) {
      const updatedPlants = plants.filter(p => p.id !== plantId);
      savePlantsToLocalStorage(updatedPlants);
      toast({ title: "Plant Removed 🗑️", description: `${plantToDelete?.name || 'The plant'} has been removed.` });
    }
  };

  const handleIrrigate = (plantId) => {
    const updatedPlants = plants.map(p => p.id === plantId ? {...p, lastIrrigated: new Date().toISOString()} : p);
    savePlantsToLocalStorage(updatedPlants);
    const plant = plants.find(p => p.id === plantId);
    toast({ title: "Irrigation Started 💧", description: `${plant.name} is being irrigated.` });
  };

  const handleFertilize = (plantId) => {
    navigate(`/fertilizer-log?plantId=${plantId}`);
  };

  const handleViewLog = (plantId) => {
     toast({
      title: "🚧 View Log Not Implemented",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-6 space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">My Greenhouse</h1>
        <Dialog open={isAddPlantDialogOpen} onOpenChange={(isOpen) => {
          setIsAddPlantDialogOpen(isOpen);
          if (!isOpen) setEditingPlant(null);
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingPlant(null); setIsAddPlantDialogOpen(true); }} className="w-full sm:w-auto">
              <PlusCircle className="w-4 h-4 mr-2" /> Add New Plant
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>{editingPlant ? 'Edit Plant' : 'Add New Plant'}</DialogTitle>
              <DialogDescription>
                {editingPlant ? `Update details for ${editingPlant.name}.` : "Fill in the details for your new plant."}
              </DialogDescription>
            </DialogHeader>
            <AddPlantForm onSubmit={handleAddPlant} existingPlantData={editingPlant} />
          </DialogContent>
        </Dialog>
      </div>

      {plants.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-10"
        >
          <Leaf className="w-16 h-16 mx-auto text-primary/50 mb-4" />
          <p className="text-muted-foreground text-lg">Your greenhouse is empty.</p>
          <p className="text-muted-foreground">Add some plants to get started!</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence>
            {plants.map((plant) => (
              <motion.div
                key={plant.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <PlantCard
                  plant={plant}
                  onIrrigate={handleIrrigate}
                  onFertilize={handleFertilize}
                  onViewLog={handleViewLog}
                  onEdit={handleEditPlant}
                  onDelete={handleDeletePlant}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;