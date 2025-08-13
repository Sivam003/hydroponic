import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Leaf } from 'lucide-react';

const plantTypes = ["Leafy Green", "Fruiting", "Herb", "Root Vegetable", "Flower"];

const AddPlantForm = ({ onSubmit, existingPlantData }) => {
  const [plantName, setPlantName] = useState('');
  const [plantingDate, setPlantingDate] = useState('');
  const [plantPhotoUrl, setPlantPhotoUrl] = useState('');
  const [plantPhotoFile, setPlantPhotoFile] = useState(null); 
  const [plantType, setPlantType] = useState('');
  const [transplantDate, setTransplantDate] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (existingPlantData) {
      setPlantName(existingPlantData.name || '');
      setPlantingDate(existingPlantData.plantingDate ? existingPlantData.plantingDate.split('T')[0] : '');
      if (existingPlantData.photo && existingPlantData.photo.startsWith('data:image')) {
        setPlantPhotoFile(existingPlantData.photo);
        setPlantPhotoUrl('');
      } else {
        setPlantPhotoUrl(existingPlantData.photo || '');
        setPlantPhotoFile(null);
      }
      setPlantType(existingPlantData.type || '');
      setTransplantDate(existingPlantData.transplantDate ? existingPlantData.transplantDate.split('T')[0] : '');
    } else {
      setPlantName('');
      setPlantingDate(new Date().toISOString().split('T')[0]);
      setPlantPhotoUrl('');
      setPlantPhotoFile(null);
      setPlantType('');
      setTransplantDate('');
    }
  }, [existingPlantData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!plantName || !plantingDate || !plantType) {
      toast({
        title: "Missing Information",
        description: "Please fill in plant name, planting date, and type.",
        variant: "destructive",
      });
      return;
    }
    const photoToSubmit = plantPhotoFile || plantPhotoUrl || null; // Ensure null if neither
    onSubmit({ 
      name: plantName, 
      plantingDate, 
      photo: photoToSubmit, 
      type: plantType,
      transplantDate: transplantDate || null 
    });
  };
  
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPlantPhotoFile(reader.result); 
        setPlantPhotoUrl(''); 
      };
      reader.readAsDataURL(file);
      toast({
        title: "Photo Ready for Preview",
        description: "Image preview is shown. This will be saved locally.",
      });
    }
  };

  const currentPhotoForDisplay = plantPhotoFile || plantPhotoUrl;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="plant-name">Plant Name</Label>
          <Input
            id="plant-name"
            value={plantName}
            onChange={(e) => setPlantName(e.target.value)}
            placeholder="e.g., Lettuce, Tomato"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="plant-type">Plant Type</Label>
          <Select value={plantType} onValueChange={setPlantType} required>
            <SelectTrigger id="plant-type">
              <SelectValue placeholder="Select plant type" />
            </SelectTrigger>
            <SelectContent>
              {plantTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="planting-date">Planting Date</Label>
          <Input
            id="planting-date"
            type="date"
            value={plantingDate}
            onChange={(e) => setPlantingDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="transplant-date">Est. Transplant Date (Optional)</Label>
          <Input
            id="transplant-date"
            type="date"
            value={transplantDate}
            onChange={(e) => setTransplantDate(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="plant-photo-url">Plant Photo (URL or Upload)</Label>
        <Input
          id="plant-photo-url"
          value={plantPhotoUrl}
          onChange={(e) => {
            setPlantPhotoUrl(e.target.value);
            if (e.target.value) setPlantPhotoFile(null); 
          }}
          placeholder="Enter image URL"
          disabled={!!plantPhotoFile} 
        />
        <Input
          id="plant-photo-upload"
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="text-sm file:mr-2 file:py-1.5 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
        />
        {currentPhotoForDisplay ? (
            <img-replace src={currentPhotoForDisplay} alt="Plant preview" className="mt-2 h-32 w-32 object-cover rounded-md border" />
        ) : (
          <div className="mt-2 h-32 w-32 flex items-center justify-center rounded-md border bg-muted">
            <Leaf className="w-12 h-12 text-muted-foreground/50" />
          </div>
        )}
      </div>

      <Button type="submit" className="w-full">
        {existingPlantData ? 'Update Plant' : 'Add Plant'}
      </Button>
    </form>
  );
};

export default AddPlantForm;