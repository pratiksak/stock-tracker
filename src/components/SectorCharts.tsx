
import { SectorSummary } from "@/types/stock";
import { formatCurrency, formatPercentage } from "@/utils/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface SectorChartsProps {
  sectorSummaries: SectorSummary[];
}

// Define chart colors
const COLORS = [
  "#0891b2", // cyan-600
  "#0e7490", // cyan-700
  "#06b6d4", // cyan-500
  "#22d3ee", // cyan-400
  "#67e8f9", // cyan-300
  "#155e75", // cyan-800
  "#164e63", // cyan-900
  "#083344", // cyan-950
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-sm text-xs">
        <p className="font-medium">{payload[0].name}: {label}</p>
        <p>Value: {formatCurrency(payload[0].value)}</p>
        {payload[0].payload.percentage && 
          <p>Portfolio: {payload[0].payload.percentage.toFixed(2)}%</p>
        }
      </div>
    );
  }
  return null;
};

const GainLossTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-sm text-xs">
        <p className="font-medium">{data.name}</p>
        <p>Investment: {formatCurrency(data.totalInvestment)}</p>
        <p>Present Value: {formatCurrency(data.presentValue)}</p>
        <p className={data.gainLoss >= 0 ? "text-gain" : "text-loss"}>
          Gain/Loss: {formatCurrency(data.gainLoss)} ({formatPercentage(data.gainLoss / data.totalInvestment * 100)})
        </p>
      </div>
    );
  }
  return null;
};

const SectorCharts = ({ sectorSummaries }: SectorChartsProps) => {
  // Prepare data for allocation chart
  const allocationData = sectorSummaries.map((sector, index) => ({
    name: sector.name,
    value: sector.presentValue,
    percentage: sector.percentage,
    color: COLORS[index % COLORS.length],
  }));

  // Prepare data for gain/loss chart
  const gainLossData = sectorSummaries.map((sector) => ({
    ...sector,
    name: sector.name,
    value: sector.gainLoss,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Portfolio Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percentage }) => `${name} (${percentage.toFixed(0)}%)`}
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sector Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={gainLossData}
                margin={{ top: 10, right: 30, left: 20, bottom: 70 }}
              >
                <XAxis 
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip content={<GainLossTooltip />} />
                <Bar dataKey="value" name="Gain/Loss">
                  {gainLossData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.gainLoss >= 0 ? "#10b981" : "#ef4444"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SectorCharts;
