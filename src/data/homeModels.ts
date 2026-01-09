
export interface HomeModel {
  id: string;
  name: string;
  price: number;
  sqm: number;
  bedrooms: number;
  bathrooms: number;
  category: string;
  imageUrl: string;
  images: string[];
  description: string;
}

export const homeModels: HomeModel[] = [
  {
    id: "1",
    name: "Modèle Serenity",
    price: 150000000, // Prix en FCFA
    sqm: 120,
    bedrooms: 3,
    bathrooms: 2,
    category: "Contemporain",
    imageUrl: "https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ],
    description: "La Serenity est une maison contemporaine aux lignes épurées, conçue pour offrir une expérience de vie paisible. Son agencement optimisé favorise la luminosité naturelle et la fluidité des espaces. Idéale pour une famille de 3 à 4 personnes."
  },
  {
    id: "2",
    name: "Modèle Harmony",
    price: 192000000, // Prix en FCFA
    sqm: 150,
    bedrooms: 4,
    bathrooms: 2,
    category: "Moderne",
    imageUrl: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ],
    description: "La Harmony est une maison moderne spacieuse offrant un cadre de vie élégant et équilibré. Ses volumes généreux et sa distribution intelligente répondent aux besoins d'une famille nombreuse. Elle intègre des solutions domotiques avancées pour un confort optimal."
  },
  {
    id: "3",
    name: "Modèle Clarity",
    price: 120000000, // Prix en FCFA
    sqm: 100,
    bedrooms: 2,
    bathrooms: 1,
    category: "Minimaliste",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ],
    description: "La Clarity incarne l'essence du minimalisme architectural. Compacte et fonctionnelle, elle offre une expérience de vie simplifiée sans compromettre le confort. Parfaite pour les jeunes couples ou les personnes seules souhaitant optimiser leur espace de vie."
  },
  {
    id: "4",
    name: "Modèle Tranquility",
    price: 168000000, // Prix en FCFA
    sqm: 130,
    bedrooms: 3,
    bathrooms: 2,
    category: "Contemporain",
    imageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571939228382-b2f2b585ce15?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ],
    description: "La Tranquility est une maison contemporaine conçue pour créer un havre de paix. Son architecture favorise l'harmonie avec l'environnement extérieur grâce à de larges baies vitrées et des espaces de transition entre intérieur et extérieur. Idéale pour ceux qui recherchent calme et sérénité."
  },
  {
    id: "5",
    name: "Modèle Excellence",
    price: 270000000, // Prix en FCFA
    sqm: 200,
    bedrooms: 5,
    bathrooms: 3,
    category: "Luxe",
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ],
    description: "L'Excellence est notre modèle haut de gamme où le luxe rencontre la fonctionnalité. Cette demeure d'exception offre des prestations premium et des finitions raffinées. Ses espaces généreux et son architecture distinctive en font un symbole de réussite et d'élégance."
  },
  {
    id: "6",
    name: "Modèle Pure",
    price: 108000000, // Prix en FCFA
    sqm: 80,
    bedrooms: 2,
    bathrooms: 1,
    category: "Minimaliste",
    imageUrl: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ],
    description: "La Pure est l'incarnation de l'efficacité minimaliste. Cette petite maison intelligemment conçue maximise chaque mètre carré pour offrir un confort surprenant malgré sa taille compacte. Solution idéale pour les terrains restreints ou les budgets maîtrisés."
  },
  {
    id: "7",
    name: "Modèle Splendor",
    price: 348000000, // Prix en FCFA
    sqm: 250,
    bedrooms: 6,
    bathrooms: 4,
    category: "Luxe",
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ],
    description: "La Splendor est notre villa d'exception, conçue sans compromis pour ceux qui exigent le meilleur. Architecture remarquable, matériaux nobles et innovations technologiques se combinent pour créer un chef-d'œuvre résidentiel où luxe et durabilité coexistent harmonieusement."
  },
  {
    id: "8",
    name: "Modèle Infinity",
    price: 210000000, // Prix en FCFA
    sqm: 170,
    bedrooms: 4,
    bathrooms: 3,
    category: "Moderne",
    imageUrl: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ],
    description: "L'Infinity repousse les limites du design moderne avec ses lignes audacieuses et ses espaces fluides. Sa conception bioclimatique optimise l'efficacité énergétique tout au long de l'année. Une maison avant-gardiste pour ceux qui envisagent l'avenir dès aujourd'hui."
  },
  {
    id: "9",
    name: "Modèle Essence",
    price: 138000000, // Prix en FCFA
    sqm: 110,
    bedrooms: 3,
    bathrooms: 2,
    category: "Contemporain",
    imageUrl: "https://images.unsplash.com/photo-1571939228382-b2f2b585ce15?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1571939228382-b2f2b585ce15?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ],
    description: "L'Essence capture l'essentiel de l'habitat contemporain dans un format accessible. Fonctionnelle et esthétique, elle offre un cadre de vie agréable pour une petite famille. Sa conception évolutive permet des adaptations futures selon l'évolution de vos besoins."
  },
];

export const carouselImages = [
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
];
