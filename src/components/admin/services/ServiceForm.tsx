
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Service, ServiceFormData } from "@/models/Service";
import { useState, useEffect } from "react";

// Define a type for the form data where features is a string
type ServiceFormShape = Omit<ServiceFormData, 'features'> & {
  features: string;
};

interface ServiceFormProps {
  editingService: Service | null;
  onSubmit: (data: ServiceFormData, file?: File) => Promise<boolean>;
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

  useEffect(() => {
    if (editingService) {
      form.reset({
        ...editingService,
        features: editingService.features.join('\n'),
      });
      setImagePreview(editingService.imageUrl);
    } else {
      form.reset({ title: "", description: "", imageUrl: "", icon: "", features: "" });
      setImagePreview(null);
    }
  }, [editingService, form]);

  // Cleanup for image preview URL
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
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (data: ServiceFormShape) => {
    const featuresArray = data.features.split('\n').map(f => f.trim()).filter(f => f);
    const processedData: ServiceFormData = {
      ...data,
      features: featuresArray,
    };
    
    const success = await onSubmit(processedData, selectedFile || undefined);

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
              <FormLabel>Image</FormLabel>
              <div className="flex gap-2 items-center">
                <FormControl>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      handleFileChange(e);
                      field.onChange(e); // Keep react-hook-form updated
                    }}
                  />
                </FormControl>
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-md" />
                )}
              </div>
              <FormMessage />
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
