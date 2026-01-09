
import { useHomeModels } from "@/hooks/useHomeModels";
import { useModelFiltering } from "@/hooks/useModelFiltering";
import ModelsSectionHeader from "./ModelsSectionHeader";
import ModelCategoryFilters from "./ModelCategoryFilters";
import ModelGrid from "./ModelGrid";

export const LyckaHomeModels = () => {
  const { homeModels } = useHomeModels();
  const { filter, setFilter, filteredModels, categoryFilters } = useModelFiltering(homeModels);

  return (
    <section className="section bg-background">
      <div className="container mx-auto">
        <ModelsSectionHeader 
          title="Nos Modèles de Maisons"
          description="LYCKA HOME propose une gamme complète de modèles de maisons, alliant esthétique moderne, fonctionnalité et performance énergétique. Chaque modèle est personnalisable selon vos besoins et préférences."
        />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h3 className="mb-4 md:mb-0">Filtrer par style</h3>
          
          <ModelCategoryFilters 
            filters={categoryFilters}
            activeFilter={filter}
            onFilterChange={setFilter}
          />
        </div>

        <ModelGrid models={filteredModels} />
      </div>
    </section>
  );
};
