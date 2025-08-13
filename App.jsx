import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { motion, AnimatePresence } from 'framer-motion';

import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

import Dashboard from '@/pages/Dashboard';
import AddPlantPage from '@/pages/AddPlantPage';
import PlantInfoPage from '@/pages/PlantInfoPage';
import FertilizerLogPage from '@/pages/FertilizerLogPage';
import IrrigationPage from '@/pages/IrrigationPage';
import NotificationsPage from '@/pages/NotificationsPage';
import SettingsPage from '@/pages/SettingsPage';
import { TooltipProvider } from '@/components/ui/tooltip';


const pageVariants = {
  initial: {
    opacity: 0,
    x: "-2vw", // Reduced x for a subtler effect
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: "2vw", // Reduced x
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate", // Softer easing
  duration: 0.35 // Slightly faster
};

const AppContent = ({ element, pageTitle }) => (
  <>
    <Header pageTitle={pageTitle} />
    <main className="flex-grow p-0 md:p-0 overflow-auto bg-background"> {/* Adjusted padding for mobile */}
      <motion.div
        key={pageTitle} 
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        {element}
      </motion.div>
    </main>
  </>
);

function App() {
  return (
    <Router>
      <TooltipProvider>
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
          <Sidebar />
          <div className="flex-grow flex flex-col overflow-hidden">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<AppContent element={<Dashboard />} pageTitle="Dashboard" />} />
                <Route path="/add-plant" element={<AppContent element={<AddPlantPage />} pageTitle="Add New Plant" />} />
                <Route path="/plant/:plantId" element={<AppContent element={<PlantInfoPage />} pageTitle="Plant Details" />} />
                <Route path="/fertilizer-log" element={<AppContent element={<FertilizerLogPage />} pageTitle="Fertilizer Log" />} />
                <Route path="/irrigation" element={<AppContent element={<IrrigationPage />} pageTitle="Irrigation Control" />} />
                <Route path="/notifications" element={<AppContent element={<NotificationsPage />} pageTitle="Notification Settings" />} />
                <Route path="/settings" element={<AppContent element={<SettingsPage />} pageTitle="Application Settings" />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </AnimatePresence>
          </div>
          <Toaster />
        </div>
      </TooltipProvider>
    </Router>
  );
}

export default App;