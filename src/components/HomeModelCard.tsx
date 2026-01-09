import { motion } from "framer-motion";
import { useHomeModelCard } from "./home-model/useHomeModelCard";
import ModelImageCarousel from "./home-model/ModelImageCarousel";
import ModelHeader from "./home-model/ModelHeader";
import ModelFeatures from "./home-model/ModelFeatures";
import ModelActions from "./home-model/ModelActions";

interface HomeModelCardProps {
  id: string;
  name: string;
  price: number;
  sqm: number;
  imageUrl: string;
  images?: string[];
  description?: string;
}

const HomeModelCard = ({
  id,
  name,
  price,
  sqm,
  imageUrl,
  images,
  description,
}: HomeModelCardProps) => {
  const {
    isHovered,
    formatPrice,
    handleHoverChange,
    handleBuyClick,
    getCarouselImages
  } = useHomeModelCard(id, name, price);
  
  const carouselImages = getCarouselImages(imageUrl, images);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
      onMouseEnter={() => handleHoverChange(true)}
      onMouseLeave={() => handleHoverChange(false)}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
    >
      <ModelImageCarousel 
        images={carouselImages}
        modelName={name}
        isHovered={isHovered}
        onHoverChange={handleHoverChange}
      />
      
      <div className="p-5">
        <ModelHeader name={name} price={price} formatPrice={formatPrice} />
        <ModelFeatures sqm={sqm} />
        {description && description.trim() && <p className="text-gray-600 text-sm mb-4">{description}</p>}
        <ModelActions id={id} onBuyClick={handleBuyClick} />
      </div>
    </motion.div>
  );
};

export default HomeModelCard;
