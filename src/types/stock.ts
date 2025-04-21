
export interface Stock {
  id: string;
  name: string;
  ticker: string;
  exchange: 'NSE' | 'BSE';
  sector: string;
  purchasePrice: number;
  quantity: number;
  currentPrice: number;
  peRatio: number;
  latestEarnings: number;
  lastUpdated: string;
}

export interface SectorSummary {
  name: string;
  totalInvestment: number;
  presentValue: number;
  gainLoss: number;
  percentage: number;
}

export interface PortfolioSummary {
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  gainLossPercentage: number;
}
