import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Droplets, Zap, Sun, Thermometer, Edit, Trash2, ImagePlus, CalendarDays, AlertTriangle, Leaf } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { formatDate, calculateDaysRemaining } from '@/lib/utils';
import { motion } from 'framer-motion';

const plantCareData = {
  "Lettuce": { sunlight: "6-8 hours", pH: "6.0-7.0", temp: "15-20°C", ec: "1.2-1.8 mS/cm", fertilizer: "Balanced NPK, high Nitrogen" },
  "Tomato": { sunlight: "8+ hours", pH: "5.5-6.5", temp: "20-25°C", ec: "2.0-3.5 mS/cm", fertilizer: "High Potassium during fruiting" },
  "Basil": { sunlight: "6-8 hours", pH: "5.5-6.5", temp: "20-30°C", ec: "1.0-1.6 mS/cm", fertilizer: "Balanced NPK" },
  "Strawberry": { sunlight: "6-10 hours", pH: "5.5-6.5", temp: "15-25°C", ec: "1.4-2.2 mS/cm", fertilizer: "High Potassium and Phosphorus" },
  "Spinach": { sunlight: "4-6 hours (can tolerate partial shade)", pH: "6.0-7.5", temp: "10-20°C", ec: "1.8-2.3 mS/cm", fertilizer: "High Nitrogen" },
  "Default": { sunlight: "N/A", pH: "N/A", temp: "N/A", ec: "N/A", fertilizer: "N/A - Check specific plant needs" }
};

const PlantInfoPage = () => {
  const { plantId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [plant, setPlant] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [newImage, setNewImage] = useState('');
  const [newImageDate, setNewImageDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const storedPlants = JSON.parse(localStorage.getItem('hydroponic_plants')) || [];
    const currentPlant = storedPlants.find(p => p.id === plantId);
    if (currentPlant) {
      setPlant(currentPlant);
      const storedGallery = JSON.parse(localStorage.getItem(`plant_gallery_${plantId}`)) || [];
      setGalleryImages(storedGallery);
    } else {
      toast({ title: "Plant not found", variant: "destructive" });
      navigate('/');
    }
  }, [plantId, navigate, toast]);

  const careInfo = plant ? (plantCareData[plant.name.split(" ")[0]] || plantCareData[plant.type] || plantCareData.Default) : plantCareData.Default;

  const handleAddImageToGallery = () => {
    if (!newImage.trim()) {
      toast({ title: "No Image URL", description: "Please provide an image URL.", variant: "destructive" });
      return;
    }
    const newGalleryEntry = { url: newImage, date: newImageDate, id: Date.now().toString() };
    const updatedGallery = [...galleryImages, newGalleryEntry];
    setGalleryImages(updatedGallery);
    localStorage.setItem(`plant_gallery_${plantId}`, JSON.stringify(updatedGallery));
    setNewImage('');
    toast({ title: "Image Added to Gallery!" });
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result); 
      };
      reader.readAsDataURL(file);
      toast({
        title: "Photo Uploaded (Placeholder)",
        description: "Image preview is shown. Actual upload to cloud storage is not implemented.",
      });
    }
  };

  const removeImageFromGallery = (imageId) => {
    const updatedGallery = galleryImages.filter(img => img.id !== imageId);
    setGalleryImages(updatedGallery);
    localStorage.setItem(`plant_gallery_${plantId}`, JSON.stringify(updatedGallery));
    toast({ title: "Image Removed" });
  };

  if (!plant) {
    return <div className="p-6 text-center">Loading plant data or plant not found...</div>;
  }
  
  const transplantDays = calculateDaysRemaining(plant.transplantDate);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-6 space-y-6"
    >
      <Card>
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <CardTitle className="text-3xl font-bold text-primary">{plant.name}</CardTitle>
            <CardDescription className="text-md">{plant.type} - Planted on {formatDate(plant.plantingDate)}</CardDescription>
          </div>
          <Button variant="outline" onClick={() => navigate('/')} className="mt-2 md:mt-0">Back to Dashboard</Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              {plant.photo && (
                <img-replace src={plant.photo} alt={plant.name} className="w-full h-auto max-h-80 object-cover rounded-lg shadow-md mb-4" />
              )}
              <Card className="bg-secondary/50">
                <CardHeader><CardTitle className="text-lg">Quick Stats</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p><Droplets className="inline mr-2 h-4 w-4 text-blue-500" />Last Irrigated: {plant.lastIrrigated ? formatDate(plant.lastIrrigated) : 'N/A'}</p>
                  <p><Zap className="inline mr-2 h-4 w-4 text-yellow-500" />Fertilizer Status: {plant.fertilizerStatus || 'N/A'}</p>
                  {transplantDays !== null && (
                    <p className={transplantDays <= 7 && transplantDays > 0 ? 'text-orange-500 font-semibold' : transplantDays === 0 ? 'text-red-600 font-bold' : ''}>
                      <CalendarDays className="inline mr-2 h-4 w-4 text-green-500" />
                      Transplant {transplantDays > 0 ? `in ${transplantDays} days` : transplantDays === 0 ? 'Today!' : `due (overdue by ${Math.abs(transplantDays)} days)`}
                      {transplantDays <= 7 && transplantDays >=0 && <AlertTriangle className="inline ml-1 h-4 w-4" />}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2">
              <Tabs defaultValue="careInfo">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="careInfo">Care Information</TabsTrigger>
                  <TabsTrigger value="growthGallery">Growth Gallery</TabsTrigger>
                </TabsList>
                <TabsContent value="careInfo" className="mt-4">
                  <Card>
                    <CardHeader><CardTitle>Ideal Conditions & Recommendations</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      <p><Sun className="inline mr-2 h-5 w-5 text-yellow-400" /><strong>Sunlight:</strong> {careInfo.sunlight}</p>
                      <p><span className="font-bold inline-block w-5 text-center mr-2 text-green-600">pH</span><strong>Ideal pH Range:</strong> {careInfo.pH}</p>
                      <p><Thermometer className="inline mr-2 h-5 w-5 text-red-500" /><strong>Temperature:</strong> {careInfo.temp}</p>
                      <p><Zap className="inline mr-2 h-5 w-5 text-blue-500" /><strong>EC Range:</strong> {careInfo.ec}</p>
                      <p><Leaf className="inline mr-2 h-5 w-5 text-green-500" /><strong>Fertilizer:</strong> {careInfo.fertilizer}</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="growthGallery" className="mt-4">
                  <Card>
                    <CardHeader><CardTitle>Plant Growth Gallery</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-2 items-end">
                          <div className="flex-grow space-y-1">
                            <Label htmlFor="new-image-url">Image URL or Upload</Label>
                            <Input id="new-image-url" value={newImage} onChange={(e) => setNewImage(e.target.value)} placeholder="Enter image URL" />
                            <Input id="new-image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="text-sm" />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="new-image-date">Date</Label>
                            <Input id="new-image-date" type="date" value={newImageDate} onChange={(e) => setNewImageDate(e.target.value)} />
                          </div>
                          <Button onClick={handleAddImageToGallery} size="sm"><ImagePlus className="mr-2 h-4 w-4" />Add Image</Button>
                        </div>
                        {galleryImages.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto p-2 border rounded-md">
                            {galleryImages.sort((a,b) => new Date(b.date) - new Date(a.date)).map((img) => (
                              <div key={img.id} className="relative group">
                                <img-replace src={img.url} alt={`Growth on ${formatDate(img.date)}`} className="w-full h-32 object-cover rounded-md" />
                                <p className="text-xs text-center mt-1 text-muted-foreground">{formatDate(img.date)}</p>
                                <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeImageFromGallery(img.id)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-center py-4">No images in the gallery yet. Add some to track growth!</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => toast({title: "🚧 Edit Not Implemented"})}>
                <Edit className="mr-2 h-4 w-4" /> Edit Plant Details
            </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PlantInfoPage;