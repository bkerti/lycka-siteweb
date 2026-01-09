
import { useState, useMemo } from "react";
import { HomeModel } from "@/models/HomeModel";

export function useModelFiltering(models: HomeModel[]) {
  const [filter, setFilter] = useState("all");

  const filteredModels = useMemo(() => {
    return filter === "all" 
      ? models 
      : models.filter(model => model.category === filter);
  }, [models, filter]);

  const categoryFilters = [
    { name: "Tous", value: "all" },
    { name: "Contemporain", value: "Contemporain" },
    { name: "Moderne", value: "Moderne" },
    { name: "Minimaliste", value: "Minimaliste" },
    { name: "Luxe", value: "Luxe" },
  ];

  return {
    filter,
    setFilter,
    filteredModels,
    categoryFilters
  };
}
