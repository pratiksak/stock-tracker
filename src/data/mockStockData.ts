
import { Stock, SectorSummary, PortfolioSummary } from "../types/stock";

// Initial stock data
const initialStocks: Stock[] = [
  {
    id: "1",
    name: "Tata Consultancy Services",
    ticker: "TCS",
    exchange: "NSE",
    sector: "Technology",
    purchasePrice: 3000,
    quantity: 10,
    currentPrice: 3200,
    peRatio: 28.5,
    latestEarnings: 80,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Infosys Limited",
    ticker: "INFY",
    exchange: "NSE",
    sector: "Technology",
    purchasePrice: 1200,
    quantity: 20,
    currentPrice: 1100,
    peRatio: 24.1,
    latestEarnings: 60,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "3",
    name: "HDFC Bank",
    ticker: "HDFCBANK",
    exchange: "NSE",
    sector: "Financials",
    purchasePrice: 1500,
    quantity: 15,
    currentPrice: 1600,
    peRatio: 22.3,
    latestEarnings: 72,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Reliance Industries",
    ticker: "RELIANCE",
    exchange: "BSE",
    sector: "Energy",
    purchasePrice: 2200,
    quantity: 8,
    currentPrice: 2350,
    peRatio: 25.7,
    latestEarnings: 92,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Bharti Airtel",
    ticker: "BHARTIARTL",
    exchange: "NSE",
    sector: "Telecom",
    purchasePrice: 700,
    quantity: 25,
    currentPrice: 720,
    peRatio: 19.8,
    latestEarnings: 36,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "6",
    name: "ITC Limited",
    ticker: "ITC",
    exchange: "NSE",
    sector: "Consumer Goods",
    purchasePrice: 340,
    quantity: 50,
    currentPrice: 320,
    peRatio: 18.4,
    latestEarnings: 17.5,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "7",
    name: "ICICI Bank",
    ticker: "ICICIBANK",
    exchange: "BSE",
    sector: "Financials",
    purchasePrice: 850,
    quantity: 20,
    currentPrice: 920,
    peRatio: 21.6,
    latestEarnings: 42.5,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "8",
    name: "Axis Bank",
    ticker: "AXISBANK",
    exchange: "NSE",
    sector: "Financials",
    purchasePrice: 780,
    quantity: 18,
    currentPrice: 740,
    peRatio: 20.2,
    latestEarnings: 36.5,
    lastUpdated: new Date().toISOString(),
  },
];

// Function to simulate price changes within a reasonable range
const simulatePriceChange = (currentPrice: number): number => {
  const changePercentage = (Math.random() * 2 - 1) * 0.5; // Random -0.5% to +0.5%
  const newPrice = currentPrice * (1 + changePercentage / 100);
  return Math.round(newPrice * 100) / 100; // Round to 2 decimal places
};

// Get updated stock data with simulated price changes
export const getUpdatedStocks = (): Stock[] => {
  return initialStocks.map((stock) => ({
    ...stock,
    currentPrice: simulatePriceChange(stock.currentPrice),
    lastUpdated: new Date().toISOString(),
  }));
};

// Calculate derived values for a stock
export const calculateStockValues = (stock: Stock) => {
  const investment = stock.purchasePrice * stock.quantity;
  const presentValue = stock.currentPrice * stock.quantity;
  const gainLoss = presentValue - investment;
  const gainLossPercentage = (gainLoss / investment) * 100;
  
  return {
    investment,
    presentValue,
    gainLoss,
    gainLossPercentage,
  };
};

// Calculate sector summaries
export const calculateSectorSummaries = (stocks: Stock[]): SectorSummary[] => {
  // Group stocks by sector
  const sectorMap = new Map<string, Stock[]>();
  
  stocks.forEach((stock) => {
    if (!sectorMap.has(stock.sector)) {
      sectorMap.set(stock.sector, []);
    }
    sectorMap.get(stock.sector)!.push(stock);
  });
  
  // Calculate totals for each sector
  const sectorSummaries: SectorSummary[] = [];
  let totalPortfolioValue = 0;
  
  stocks.forEach((stock) => {
    totalPortfolioValue += stock.currentPrice * stock.quantity;
  });
  
  sectorMap.forEach((sectorStocks, sectorName) => {
    let totalInvestment = 0;
    let presentValue = 0;
    
    sectorStocks.forEach((stock) => {
      const { investment, presentValue: stockPresentValue } = calculateStockValues(stock);
      totalInvestment += investment;
      presentValue += stockPresentValue;
    });
    
    const gainLoss = presentValue - totalInvestment;
    const percentage = (presentValue / totalPortfolioValue) * 100;
    
    sectorSummaries.push({
      name: sectorName,
      totalInvestment,
      presentValue,
      gainLoss,
      percentage,
    });
  });
  
  return sectorSummaries;
};

// Calculate overall portfolio summary
export const calculatePortfolioSummary = (stocks: Stock[]): PortfolioSummary => {
  let totalInvestment = 0;
  let totalPresentValue = 0;
  
  stocks.forEach((stock) => {
    const { investment, presentValue } = calculateStockValues(stock);
    totalInvestment += investment;
    totalPresentValue += presentValue;
  });
  
  const totalGainLoss = totalPresentValue - totalInvestment;
  const gainLossPercentage = (totalGainLoss / totalInvestment) * 100;
  
  return {
    totalInvestment,
    totalPresentValue,
    totalGainLoss,
    gainLossPercentage,
  };
};
