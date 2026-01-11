import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Service, ServiceFormData } from "@/models/Service";
import { useState, useEffect } from "react";
import { Upload } from "lucide-react"; // Import Upload icon

// Define a type for the form data where features is a string
type ServiceFormShape = Omit<ServiceFormData, 'features'> & {
  features: string;
};

interface ServiceFormProps {
  editingService: Service | null;
  onSubmit: (data: ServiceFormData) => Promise<boolean>; // file param removed
  onCancel: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ 
  editingService, 
  onSubmit, 
  onCancel 
}) => {
  const form = useForm<ServiceFormShape>({
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      icon: "",
      features: "",
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Set initial form values and image preview when editingService changes
  useEffect(() => {
    if (editingService) {
      form.reset({
        ...editingService,
        features: editingService.features ? editingService.features.join('\n') : '',
      });
      setImagePreview(editingService.imageUrl);
    } else {
      form.reset({ title: "", description: "", imageUrl: "", icon: "", features: "" });
      setImagePreview(null);
    }
    setSelectedFile(null); // Clear selected file when form is reset or editingService changes
  }, [editingService, form]);

  // Cleanup for image preview URL (for createObjectURL)
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      // Revoke old URL if it was a blob URL
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      // If no file selected, and we are not in editing mode, clear preview
      if (!editingService) {
        setImagePreview(null);
      }
    }
  };

  const uploadFile = async (file: File) => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      toast.error("Authentification requise pour l'upload.");
      return null;
    }
    
    const endpoint = `/api/upload?filename=${encodeURIComponent(file.name)}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: file,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.url; // Vercel Blob returns the URL in the 'url' property
    } catch (error) {
      console.error(`Error uploading file:`, error);
      toast.error(`Échec du téléchargement du fichier.`);
      return null;
    }
  };

  const handleAddImage = async () => {
    if (!selectedFile) {
      toast.error("Veuillez sélectionner un fichier à télécharger.");
      return;
    }

    const uploadedUrl = await uploadFile(selectedFile);
    if (uploadedUrl) {
      form.setValue("imageUrl", uploadedUrl);
      setSelectedFile(null); // Clear selected file from input
      setImagePreview(uploadedUrl); // Update preview to the permanent URL
      toast.success("Image ajoutée avec succès !");
    }
  };

  const handleSubmit = async (data: ServiceFormShape) => {
    const featuresArray = data.features.split('\n').map(f => f.trim()).filter(f => f);
    const processedData: ServiceFormData = {
      ...data,
      features: featuresArray,
    };
    
    // Pass processedData directly, imageUrl should already be set by handleAddImage or editingService
    const success = await onSubmit(processedData); 

    if (success && !editingService) {
      form.reset();
      setSelectedFile(null);
      setImagePreview(null);
      toast.info("Formulaire vidé pour la prochaine saisie.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder="Titre du service" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Description détaillée du service" 
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="features"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Features</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter features, one per line"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image du service</FormLabel>
                            <FormControl>
                              <div className="space-y-2"> {/* This is the single child of FormControl */}
                                {/* Always visible file input */}
                                <Input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleFileChange}
                                    className="flex-1"
                                />
                                
                                {/* Conditional rendering for image preview and buttons */}
                                {imagePreview && (
                                    <div className="flex items-center gap-2">
                                        <img src={imagePreview} alt="Aperçu" className="w-20 h-20 object-cover rounded-md" />
                                        
                                        {selectedFile ? ( // If a new file is selected, show Add/Cancel for new file
                                            <>
                                                <Button type="button" onClick={handleAddImage} disabled={!selectedFile}>
                                                    <Upload className="mr-2" size={16} /> Ajouter l'image
                                                </Button>
                                                <Button type="button" variant="outline" size="sm" onClick={() => {
                                                    setSelectedFile(null);
                                                    if (imagePreview && imagePreview.startsWith("blob:")) {
                                                        URL.revokeObjectURL(imagePreview);
                                                    }
                                                    setImagePreview(editingService?.imageUrl || null); // Revert to existing image or null
                                                    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                                                    if (fileInput) fileInput.value = '';
                                                }}>
                                                    Annuler
                                                </Button>
                                            </>
                                        ) : ( // No new file selected, show remove for existing image if any
                                            editingService?.imageUrl && ( // Only show if there's an existing image
                                                <Button type="button" variant="destructive" size="sm" onClick={() => {
                                                    form.setValue("imageUrl", "");
                                                    setImagePreview(null);
                                                    toast.info("Image du service supprimée.");
                                                }}>
                                                    <Trash2 className="mr-2" size={16} /> Supprimer
                                                </Button>
                                            )
                                        )}
                                    </div>
                                )}
                                {/* Hidden input to store the URL (always rendered) */}
                                <Input type="hidden" {...field} /> 
                              </div>
                            </FormControl>              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icône</FormLabel>
              <FormControl>
                <Input placeholder="Nom de l'icône" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-2">
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button type="submit">
            {editingService ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ServiceForm;