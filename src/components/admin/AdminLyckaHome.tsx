
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useHomeModelsContext } from "@/hooks/useHomeModelsContext";
import HomeModelList from "@/components/admin/home-models/HomeModelList";
import HomeModelForm from "@/components/admin/home-models/HomeModelForm";

const AdminLyckaHome = () => {
  const {
    homeModels,
    editingModel,
    currentMedia,
    handleEdit,
    handleDelete,
    handleSubmit,
    resetForm,
    addMediaToGallery,
    removeMediaFromGallery
  } = useHomeModelsContext();
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to form when a new model is created or a model is selected for editing
    if (editingModel !== undefined) {
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
  }, [editingModel]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Modèles LYCKA Home</h1>
        <Button onClick={resetForm}>
          <Plus className="mr-2" size={16} />
          Nouveau Modèle
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste des modèles existants */}
        <HomeModelList 
          models={homeModels} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />

        {/* Formulaire d'édition */}
        <div ref={formRef}>
          <HomeModelForm 
            editingModel={editingModel}
            currentMedia={currentMedia}
            onSubmit={handleSubmit}
            onReset={resetForm}
            onAddMedia={addMediaToGallery}
            onRemoveMedia={removeMediaFromGallery}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminLyckaHome;
