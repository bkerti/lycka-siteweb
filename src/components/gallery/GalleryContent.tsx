
import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import GalleryFilters from "./GalleryFilters";
import GalleryMediaGrid from "./GalleryMediaGrid";
import { useGalleryItems } from "@/hooks/useGalleryItems";

const GalleryContent = () => {
  const [filter, setFilter] = useState("all");
  const [category, setCategory] = useState("all");
  
  const { mediaItems, filteredItems, categories } = useGalleryItems(filter, category);

  return (
    <section className="section bg-background">
      <div className="container mx-auto">
        <div className="flex flex-col space-y-6">
          <GalleryFilters 
            filter={filter}
            setFilter={setFilter}
            category={category}
            setCategory={setCategory}
            categories={categories}
          />
          <GalleryMediaGrid items={filteredItems} />
        </div>
      </div>
    </section>
  );
};

export default GalleryContent;
