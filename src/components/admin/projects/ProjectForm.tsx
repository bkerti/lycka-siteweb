import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // No longer used
import { Upload, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Project } from "@/models/Project";
import { useState, useEffect } from "react";

interface ProjectFormProps {
  editingProject: Project | null;
  onSubmit: (data: Omit<Project, "id" | "media">, media: { url: string; type: string }[]) => Promise<boolean>;
  onCancel: () => void;
}

const subCategories = ["residentiel", "commercial", "institutionnel", "industriel"];

const ProjectForm: React.FC<ProjectFormProps> = ({ 
  editingProject, 
  onSubmit, 
  onCancel 
}) => { 
  const [currentMedia, setCurrentMedia] = useState<{ url: string; type: string }[]>(editingProject?.media || []);
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const form = useForm({
    defaultValues: {
      title: editingProject?.title || "",
      status: editingProject?.status || "conceptions",
      category: editingProject?.category || "",
      description: editingProject?.description || "",
      mediaUrl: "",
    },
  });

  // Cleanup for image preview URL
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedImageFiles(files);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
    } else {
      setSelectedImageFiles([]);
      setImagePreviews([]);
    }
  };

  const uploadFile = async (file: File, type: 'image') => {
    const formData = new FormData();
    formData.append(type, file);
    const endpoint = '/api/upload';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      toast.error(`Échec du téléchargement de l'image.`);
      return null;
    }
  };

  const handleAddMedia = async () => {
    const mediaUrl = form.getValues("mediaUrl");
    let uploadedUrls: { url: string; type: string }[] = [];

    if (selectedImageFiles.length > 0) {
      const uploadPromises = selectedImageFiles.map(file => uploadFile(file, 'image'));
      const urls = await Promise.all(uploadPromises);
      urls.forEach(url => {
        if (url) {
          uploadedUrls.push({ url, type: 'image' });
        }
      });
    } else if (mediaUrl) {
      uploadedUrls.push({ url: mediaUrl, type: 'image' });
    }

    if (uploadedUrls.length > 0) {
      setCurrentMedia([...currentMedia, ...uploadedUrls]);
      form.setValue("mediaUrl", "");
      setSelectedImageFiles([]);
      setImagePreviews([]);
      toast.success(`${uploadedUrls.length} média(s) ajouté(s) à la galerie`);
    }
  };

  const removeMediaFromGallery = (index: number) => {
    setCurrentMedia(currentMedia.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (data: { title: string; status: string; category: string; description: string; mediaUrl: string; }) => {
    const { mediaUrl, ...projectData } = data;
    const success = await onSubmit(projectData, currentMedia);
    if (success && !editingProject) {
      form.reset({
        title: "",
        status: "conceptions",
        category: "",
        description: "",
        mediaUrl: "",
      });
      setCurrentMedia([]);
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
      setSelectedImageFiles([]);
      setImagePreviews([]);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder="Titre du projet" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de projet</FormLabel>
              <FormControl>
                <select {...field} className="block w-full p-2 border border-input bg-background rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option value="conceptions">Conceptions</option>
                  <option value="realisations">Réalisations</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie</FormLabel>
              <FormControl>
                <select {...field} className="block w-full p-2 border border-input bg-background rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option value="">Sélectionnez une catégorie</option>
                  {subCategories.map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
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
                  placeholder="Description détaillée du projet" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Galerie de médias</FormLabel>
          
          {currentMedia.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {currentMedia.map((mediaItem, index) => (
                <div key={index} className="relative group">
                  <img 
                      src={mediaItem.url} 
                      alt={`Média ${index + 1}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                  <button 
                    type="button"
                    onClick={() => removeMediaFromGallery(index)}
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded"
                  >
                    <Trash2 size={16} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex flex-col gap-4">
            {/* Image Upload */}
            <div className="flex gap-2 items-end">
              <FormItem className="flex-1">
                <FormLabel>Télécharger une ou plusieurs images</FormLabel>
                <FormControl>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    multiple
                    onChange={handleImageFileChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              <div className="flex gap-2">
                {imagePreviews.map((preview, index) => (
                  <img key={index} src={preview} alt={`Preview ${index + 1}`} className="w-16 h-16 object-cover rounded" />
                ))}
              </div>
            </div>

            {/* Media URL Input */}
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="mediaUrl"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Ou ajouter une URL de média</FormLabel>
                    <FormControl>
                      <Input placeholder="URL de l'image" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="button" 
                onClick={handleAddMedia}
                className="self-end"
              >
                Ajouter
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button type="submit">
            {editingProject ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProjectForm;