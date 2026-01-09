
import MediaCard from "@/components/gallery/MediaCard";
import { GalleryItem } from "@/hooks/useGalleryItems";

interface GalleryMediaGridProps {
  items: GalleryItem[];
}

const GalleryMediaGrid = ({ items }: GalleryMediaGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <MediaCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default GalleryMediaGrid;
