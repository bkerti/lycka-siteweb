import { HomeModel } from "@/models/HomeModel";

interface ModelCharacteristicsProps {
  model: HomeModel;
  formatPrice: (price: number) => string;
}

const ModelCharacteristics = ({ model, formatPrice }: ModelCharacteristicsProps) => {
  return (
    <div className="bg-card p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-semibold mb-4">Caractéristiques</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <svg
            className="w-6 h-6 text-lycka-secondary mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <span>{model.sqm} m²</span>
        </div>
        
        <div className="flex items-center">
          <svg
            className="w-6 h-6 text-lycka-secondary mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span>{formatPrice(model.price)}</span>
        </div>
      </div>
    </div>
  );
};

export default ModelCharacteristics;
