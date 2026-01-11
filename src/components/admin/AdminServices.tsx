
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import ServiceList from "./services/ServiceList";
import ServiceForm from "./services/ServiceForm";
import { useServicesContext } from "@/hooks/useServicesContext";
import ConfirmationDialog from "./ConfirmationDialog";
import { ServiceFormData } from '@/models/Service';

const AdminServices = () => {
  const {
    services,
    editingService,
    setEditingService,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleCancel
  } = useServicesContext();

  const [dialogState, setDialogState] = useState<{isOpen: boolean, action: string, data: string | ServiceFormData | null, file?: File}>({ 
    isOpen: false, 
    action: 'submit', 
    data: null
  });

  const handleDeleteRequest = (id: string) => {
    setDialogState({ isOpen: true, action: 'delete', data: id });
  };

  const handleSubmitRequest = (data: ServiceFormData, file?: File) => {
    setDialogState({ isOpen: true, action: 'submit', data: data, file: file });
  };

  const confirmAction = () => {
    if (dialogState.action === 'delete') {
      if (typeof dialogState.data === 'string') {
        handleDelete(dialogState.data);
      }
    } else {
      if (dialogState.data && typeof dialogState.data !== 'string') {
        handleSubmit(dialogState.data, dialogState.file);
      }
    }
    setDialogState({ isOpen: false, action: 'submit', data: null });
  };

  const cancelAction = () => {
    setDialogState({ isOpen: false, action: 'submit', data: null });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Services</h1>
        <Button onClick={() => setEditingService(null)}>
          <Plus className="mr-2" size={16} />
          Nouveau Service
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ServiceList
          services={services}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />

        <div>
          <h2 className="text-lg font-medium mb-4">
            {editingService ? 'Modifier le service' : 'Ajouter un service'}
          </h2>
          <Card>
            <CardContent className="pt-6">
              <ServiceForm
                editingService={editingService}
                onSubmit={handleSubmitRequest}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* <ConfirmationDialog
        isOpen={dialogState.isOpen}
        onClose={cancelAction}
        onConfirm={confirmAction}
        title={dialogState.action === 'delete' 
          ? "Confirmer la suppression" 
          : (editingService ? "Confirmer la modification" : "Confirmer l'ajout")
        }
        description={dialogState.action === 'delete'
          ? "Êtes-vous sûr de vouloir supprimer ce service ? Cette action ne pourra pas être annulée."
          : (editingService 
              ? "Confirmer les modifications apportées à ce service ?" 
              : "Confirmer l'ajout de ce nouveau service ?")
        }
        confirmText={dialogState.action === 'delete' ? "Supprimer" : "Confirmer"}
      /> */}
    </div>
  );
};

export default AdminServices;
