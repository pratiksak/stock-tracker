
import { useState, useEffect } from "react";

interface HeaderProps {
  lastUpdated: string;
}

const Header = ({ lastUpdated }: HeaderProps) => {
  const [formattedTime, setFormattedTime] = useState<string>("");
  
  useEffect(() => {
    if (!lastUpdated) return;
    
    const date = new Date(lastUpdated);
    
    // Format the time as HH:MM:SS
    const timeFormatter = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    
    setFormattedTime(timeFormatter.format(date));
  }, [lastUpdated]);
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stock Vision Tracker</h1>
        <p className="text-muted-foreground">Monitor your portfolio performance in real-time</p>
      </div>
      
      <div className="mt-2 sm:mt-0 flex items-center text-sm">
        <span className="text-muted-foreground mr-2">Last updated:</span>
        <span className="font-medium animate-pulse-subtle">{formattedTime}</span>
      </div>
    </div>
  );
};

export default Header;
