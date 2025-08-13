import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, Leaf, Droplets, Bell, Settings, BarChart3, Thermometer, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { to: "/", icon: Home, label: "Dashboard" },
  { to: "/add-plant", icon: PlusCircle, label: "Add Plant" },
  { to: "/fertilizer-log", icon: Leaf, label: "Fertilizer Log" },
  { to: "/irrigation", icon: Droplets, label: "Irrigation" },
  { to: "/notifications", icon: Bell, label: "Notifications" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

const Sidebar = () => {
  return (
    <motion.div 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="w-64 bg-card text-card-foreground p-4 space-y-6 border-r border-border flex flex-col shadow-lg"
    >
      <div className="flex items-center space-x-2 p-2">
        <Leaf className="w-10 h-10 text-primary" />
        <h1 className="text-2xl font-bold text-primary">HydroPonic</h1>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-primary/10 hover:text-primary ${
                    isActive ? 'bg-primary/20 text-primary font-semibold' : 'text-muted-foreground'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto p-2 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          HydroPonic Manager v1.0
        </p>
        <div className="mt-2 flex justify-around">
            <BarChart3 className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer" title="Sensor Data Placeholder"/>
            <Thermometer className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer" title="Temperature Placeholder"/>
            <Zap className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer" title="EC Placeholder"/>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;