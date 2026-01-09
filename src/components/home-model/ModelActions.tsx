import { Button } from "@/components/ui/button";

interface ModelActionsProps {
  id: string;
  onBuyClick: () => void;
}

const ModelActions = ({ onBuyClick }: ModelActionsProps) => {
  return (
    <div className="flex space-x-2">
      {/* The "Details" button was removed because the entire card is now a link. */}
      <Button onClick={onBuyClick} className="flex-1 bg-lycka-secondary hover:bg-lycka-primary">
        Acheter
      </Button>
    </div>
  );
};

export default ModelActions;
