
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import Header from "./Header";
import SummaryCards from "./SummaryCards";
import StockTable from "./StockTable";
import SectorCharts from "./SectorCharts";
import RefreshButton from "./RefreshButton";
import { Stock } from "@/types/stock";
import { getUpdatedStocks, calculateSectorSummaries, calculatePortfolioSummary } from "@/data/mockStockData";

const UPDATE_INTERVAL = 15000; // 15 seconds in milliseconds

const Dashboard = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // Fetch initial stock data
  useEffect(() => {
    fetchStockData();
    // Set up interval for refreshing data
    const intervalId = setInterval(fetchStockData, UPDATE_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  const fetchStockData = () => {
    try {
      // In a real app, this would be an API call
      const newStocks = getUpdatedStocks();
      setStocks(newStocks);
      setLastUpdated(new Date().toISOString());
      setLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      console.error("Error fetching stock data:", error);
      toast.error("Failed to update stock data. Please try again.");
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(fetchStockData, 500); // Add small delay to show loading state
    toast.success("Refreshing stock data...");
  };

  // Calculate derived data
  const portfolioSummary = calculatePortfolioSummary(stocks);
  const sectorSummaries = calculateSectorSummaries(stocks);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading portfolio data...</div>;
  }

  return (
    <div className="container py-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stock Vision Tracker</h1>
          <p className="text-muted-foreground">Monitor your portfolio performance in real-time</p>
        </div>
        
        <div className="mt-2 sm:mt-0 flex items-center">
          <div className="text-sm mr-2">
            <span className="text-muted-foreground mr-1">Last updated:</span>
            <span className="font-medium animate-pulse-subtle">
              {new Date(lastUpdated).toLocaleTimeString()}
            </span>
          </div>
          <RefreshButton onRefresh={handleRefresh} isRefreshing={isRefreshing} />
        </div>
      </div>
      <SummaryCards summary={portfolioSummary} />
      <SectorCharts sectorSummaries={sectorSummaries} />
      <h2 className="text-xl font-semibold mb-4">Portfolio Holdings</h2>
      <StockTable stocks={stocks} totalPortfolioValue={portfolioSummary.totalPresentValue} />
    </div>
  );
};

export default Dashboard;
