
interface ModelFeaturesProps {
  sqm: number;
}

const ModelFeatures = ({ sqm }: ModelFeaturesProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <svg
          className="w-5 h-5 text-gray-500 mr-1"
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
        <span className="text-sm text-gray-600">{sqm} m²</span>
      </div>
    </div>
  );
};

export default ModelFeatures;
