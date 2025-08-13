import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplets, Zap, CalendarClock, Info, Edit, Trash2, Leaf } from 'lucide-react';
import { formatDate, calculateDaysRemaining } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PlantCard = ({ plant, onIrrigate, onFertilize, onViewLog, onEdit, onDelete }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const transplantDays = calculateDaysRemaining(plant.transplantDate);

  const handleNotImplemented = (feature) => {
     toast({
      title: `🚧 ${feature} Not Implemented`,
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleViewDetails = () => {
    navigate(`/plant/${plant.id}`);
  };

  const getFertilizerDisplay = (status) => {
    if (!status || status === 'Nominal') return 'Nominal';
    if (status.startsWith('Applied')) {
      const parts = status.split(' on ');
      const fertilizerName = parts[0].replace('Applied ', '');
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="truncate cursor-default">Applied: {fertilizerName}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{status}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return status;
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col"
    >
      <Card className="w-full overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col flex-grow">
        <CardHeader className="p-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold text-primary">{plant.name}</CardTitle>
            <div className="flex space-x-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(plant)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDelete(plant.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{plant.type}</p>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-grow">
          {plant.photo ? (
            <div className="w-full h-32 mb-3 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700">
              <img-replace src={plant.photo} alt={plant.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-full h-32 mb-3 rounded-md overflow-hidden bg-muted flex items-center justify-center">
              <Leaf className="w-16 h-16 text-primary/30" />
            </div>
          )}
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center"><Droplets className="w-4 h-4 mr-1.5 text-blue-500" /> Last Irrigated:</span>
              <span className="font-medium text-right truncate">{plant.lastIrrigated ? formatDate(plant.lastIrrigated) : 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center"><Zap className="w-4 h-4 mr-1.5 text-yellow-500" /> Fertilizer:</span>
              <div className="font-medium text-right overflow-hidden max-w-[150px]">{getFertilizerDisplay(plant.fertilizerStatus)}</div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center"><CalendarClock className="w-4 h-4 mr-1.5 text-green-500" /> Transplant In:</span>
              <span className="font-medium text-right truncate">{transplantDays !== null ? `${transplantDays} days` : 'N/A'}</span>
            </div>
             <p className="text-xs text-muted-foreground pt-1">Planted: {formatDate(plant.plantingDate)}</p>
          </div>
        </CardContent>
        <CardFooter className="p-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-auto">
          <Button variant="outline" size="sm" className="w-full sm:flex-1" onClick={() => onIrrigate(plant.id)}>
            <Droplets className="w-3 h-3 mr-1" /> Irrigate
          </Button>
          <Button variant="outline" size="sm" className="w-full sm:flex-1" onClick={() => onFertilize(plant.id)}>
            <Zap className="w-3 h-3 mr-1" /> Fertilize
          </Button>
          <Button variant="outline" size="sm" className="w-full sm:flex-1" onClick={handleViewDetails}>
            <Info className="w-3 h-3 mr-1" /> Details
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PlantCard;