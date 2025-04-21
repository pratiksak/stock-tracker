
import { PortfolioSummary } from "@/types/stock";
import { formatCurrency, formatPercentage } from "@/utils/formatters";
import { ArrowDown, ArrowUp } from "lucide-react";

interface SummaryCardsProps {
  summary: PortfolioSummary;
}

const SummaryCards = ({ summary }: SummaryCardsProps) => {
  const { totalInvestment, totalPresentValue, totalGainLoss, gainLossPercentage } = summary;
  const isProfit = totalGainLoss >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Investment</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalInvestment)}</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Present Value</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalPresentValue)}</p>
      </div>
      
      <div className={`p-6 rounded-lg shadow-sm border ${
        isProfit ? 'bg-gain-light border-gain' : 'bg-loss-light border-loss'
      }`}>
        <h3 className="text-sm font-medium text-gray-600 mb-2">Net Gain/Loss</h3>
        <div className="flex items-center">
          <p className={`text-2xl font-bold ${isProfit ? 'text-gain' : 'text-loss'}`}>
            {formatCurrency(totalGainLoss)}
          </p>
          <div className={`ml-2 flex items-center text-sm ${isProfit ? 'text-gain' : 'text-loss'}`}>
            {isProfit ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            <span className="ml-1">{formatPercentage(gainLossPercentage)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
