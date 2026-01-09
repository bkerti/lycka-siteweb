
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GalleryFiltersProps {
  filter: string;
  setFilter: (filter: string) => void;
  category: string;
  setCategory: (category: string) => void;
  categories: string[];
}

const GalleryFilters = ({
  filter,
  setFilter,
  category,
  setCategory,
  categories,
}: GalleryFiltersProps) => {
  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h2>Notre galerie média</h2>
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="projects">Projets</TabsTrigger>
            <TabsTrigger value="lycka-home">LYCKA HOME</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-md transition-colors",
              category === cat
                ? "bg-lycka-secondary text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            )}
          >
            {cat === "all" ? "Toutes catégories" : cat}
          </button>
        ))}
      </div>
    </>
  );
};

export default GalleryFilters;
