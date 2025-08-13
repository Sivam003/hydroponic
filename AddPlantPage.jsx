import React from 'react';
import AddPlantForm from '@/components/AddPlantForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AddPlantPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddPlantSubmit = (plantData) => {
    const plants = JSON.parse(localStorage.getItem('hydroponic_plants')) || [];
    const plantExists = plants.find(p => p.name.toLowerCase() === plantData.name.toLowerCase());

    if (plantExists) {
      toast({
        title: "Plant Exists",
        description: `A plant with the name "${plantData.name}" already exists.`,
        variant: "destructive",
      });
      return;
    }
    
    const newPlant = { 
      id: Date.now().toString(), 
      ...plantData, // photo is included here from plantData
      lastIrrigated: null, 
      fertilizerStatus: 'Nominal',
    };
    const updatedPlants = [...plants, newPlant];
    localStorage.setItem('hydroponic_plants', JSON.stringify(updatedPlants));
    toast({
      title: "Plant Added! 🌱",
      description: `${plantData.name} is now growing in your system.`,
    });
    navigate('/'); 
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-2xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add a New Plant</CardTitle>
          <CardDescription>Fill in the details for your new plant.</CardDescription>
        </CardHeader>
        <CardContent>
          <AddPlantForm onSubmit={handleAddPlantSubmit} />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AddPlantPage;