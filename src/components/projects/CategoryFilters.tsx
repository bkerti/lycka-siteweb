
import { cn } from "@/lib/utils";

interface CategoryFilter {
  name: string;
  value: string;
}

interface CategoryFiltersProps {
  filters: CategoryFilter[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({ 
  filters, 
  activeFilter, 
  onFilterChange 
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {filters.map((category) => (
        <button
          key={category.value}
          onClick={() => onFilterChange(category.value)}
          className={cn(
            "px-4 py-2 rounded-md transition-colors",
            activeFilter === category.value
              ? "bg-lycka-secondary text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilters;
