
import { useState } from "react";
import { Stock } from "@/types/stock";
import { formatCurrency, formatNumber, formatPercentage } from "@/utils/formatters";
import { ArrowUp, ArrowDown } from "lucide-react";
import { calculateStockValues } from "@/data/mockStockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface StockTableProps {
  stocks: Stock[];
  totalPortfolioValue: number;
}

interface SortConfig {
  key: keyof Stock | "investment" | "presentValue" | "gainLoss" | "gainLossPercentage" | "portfolioWeight";
  direction: "asc" | "desc";
}

const StockTable = ({ stocks, totalPortfolioValue }: StockTableProps) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "name",
    direction: "asc",
  });

  const requestSort = (key: SortConfig["key"]) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortedStocks = () => {
    const sortableStocks = [...stocks];
    sortableStocks.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      // Handle derived values that aren't directly in the stock object
      if (sortConfig.key === "investment") {
        aValue = calculateStockValues(a).investment;
        bValue = calculateStockValues(b).investment;
      } else if (sortConfig.key === "presentValue") {
        aValue = calculateStockValues(a).presentValue;
        bValue = calculateStockValues(b).presentValue;
      } else if (sortConfig.key === "gainLoss") {
        aValue = calculateStockValues(a).gainLoss;
        bValue = calculateStockValues(b).gainLoss;
      } else if (sortConfig.key === "gainLossPercentage") {
        aValue = calculateStockValues(a).gainLossPercentage;
        bValue = calculateStockValues(b).gainLossPercentage;
      } else if (sortConfig.key === "portfolioWeight") {
        aValue = (a.currentPrice * a.quantity) / totalPortfolioValue * 100;
        bValue = (b.currentPrice * b.quantity) / totalPortfolioValue * 100;
      } else {
        // Direct stock properties
        aValue = a[sortConfig.key as keyof Stock];
        bValue = b[sortConfig.key as keyof Stock];
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    return sortableStocks;
  };

  const sortedStocks = getSortedStocks();
  const groupedStocks: Record<string, Stock[]> = {};

  // Group stocks by sector
  sortedStocks.forEach(stock => {
    if (!groupedStocks[stock.sector]) {
      groupedStocks[stock.sector] = [];
    }
    groupedStocks[stock.sector].push(stock);
  });

  // Sort sector names
  const sortedSectors = Object.keys(groupedStocks).sort();

  // Create header with sort functionality
  const SortableHeader = ({ label, sortKey }: { label: string; sortKey: SortConfig["key"] }) => (
    <div 
      className="flex items-center cursor-pointer hover:text-finance"
      onClick={() => requestSort(sortKey)}
    >
      <span>{label}</span>
      {sortConfig.key === sortKey && (
        <span className="ml-1">
          {sortConfig.direction === "asc" ? "↑" : "↓"}
        </span>
      )}
    </div>
  );

  return (
    <div className="overflow-x-auto mb-8">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-40"><SortableHeader label="Stock" sortKey="name" /></TableHead>
            <TableHead><SortableHeader label="Purchase Price" sortKey="purchasePrice" /></TableHead>
            <TableHead><SortableHeader label="Qty" sortKey="quantity" /></TableHead>
            <TableHead><SortableHeader label="Investment" sortKey="investment" /></TableHead>
            <TableHead><SortableHeader label="Portfolio %" sortKey="portfolioWeight" /></TableHead>
            <TableHead><SortableHeader label="Exchange" sortKey="exchange" /></TableHead>
            <TableHead className="animate-pulse-subtle"><SortableHeader label="CMP" sortKey="currentPrice" /></TableHead>
            <TableHead><SortableHeader label="Present Value" sortKey="presentValue" /></TableHead>
            <TableHead><SortableHeader label="Gain/Loss" sortKey="gainLoss" /></TableHead>
            <TableHead><SortableHeader label="P/E Ratio" sortKey="peRatio" /></TableHead>
            <TableHead><SortableHeader label="EPS" sortKey="latestEarnings" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedSectors.map(sector => (
            <>
              <TableRow key={`sector-${sector}`} className="bg-muted/50">
                <TableCell colSpan={11} className="font-medium py-2">
                  {sector}
                </TableCell>
              </TableRow>
              {groupedStocks[sector].map(stock => {
                const { investment, presentValue, gainLoss, gainLossPercentage } = calculateStockValues(stock);
                const portfolioWeight = (presentValue / totalPortfolioValue) * 100;
                const isProfit = gainLoss >= 0;
                
                return (
                  <TableRow key={stock.id}>
                    <TableCell className="font-medium">
                      <div>{stock.ticker}</div>
                      <div className="text-xs text-muted-foreground">{stock.name}</div>
                    </TableCell>
                    <TableCell>{formatCurrency(stock.purchasePrice)}</TableCell>
                    <TableCell>{formatNumber(stock.quantity)}</TableCell>
                    <TableCell>{formatCurrency(investment)}</TableCell>
                    <TableCell>{portfolioWeight.toFixed(2)}%</TableCell>
                    <TableCell>{stock.exchange}</TableCell>
                    <TableCell className="animate-pulse-subtle">{formatCurrency(stock.currentPrice)}</TableCell>
                    <TableCell>{formatCurrency(presentValue)}</TableCell>
                    <TableCell>
                      <div className={`flex items-center ${isProfit ? 'text-gain' : 'text-loss'}`}>
                        <span>{formatCurrency(gainLoss)}</span>
                        <div className="ml-2 flex items-center text-xs">
                          {isProfit ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                          <span>{formatPercentage(gainLossPercentage)}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{stock.peRatio.toFixed(1)}</TableCell>
                    <TableCell>₹{stock.latestEarnings}</TableCell>
                  </TableRow>
                );
              })}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StockTable;
