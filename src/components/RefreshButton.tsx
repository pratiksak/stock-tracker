
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface RefreshButtonProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

const RefreshButton = ({ onRefresh, isRefreshing }: RefreshButtonProps) => {
  return (
    <Button 
      onClick={onRefresh}
      disabled={isRefreshing}
      variant="outline"
      className="ml-2"
      size="sm"
    >
      {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
      {!isRefreshing && <ArrowRight className="ml-2 h-4 w-4" />}
    </Button>
  );
};

export default RefreshButton;
