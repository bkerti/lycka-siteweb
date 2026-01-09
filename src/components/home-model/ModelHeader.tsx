
interface ModelHeaderProps {
  name: string;
  price: number;
  formatPrice: (price: number) => string;
}

const ModelHeader = ({ name, price, formatPrice }: ModelHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-3">
      <h3 className="text-xl font-semibold">{name}</h3>
      <span className="text-lycka-secondary font-bold">
        {formatPrice(price)}
      </span>
    </div>
  );
};

export default ModelHeader;
