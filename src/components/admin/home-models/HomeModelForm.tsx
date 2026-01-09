import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { HomeModel } from "@/models/HomeModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface HomeModelFormProps {
  editingModel: HomeModel | null;
  currentMedia: { url: string; type: string }[];
  onSubmit: (data: Partial<HomeModel>) => void;
  onReset: () => void;
  onAddMedia: (mediaItem: { url: string; type: string }) => void;
  onRemoveMedia: (index: number) => void;
}

const HomeModelForm = ({
  editingModel,
  currentMedia,
  onSubmit,
  onReset,
  onAddMedia,
  onRemoveMedia
}: HomeModelFormProps) => {
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const form = useForm({
    defaultValues: {
      name: editingModel?.name || "",
      price: editingModel?.price || 0,
      sqm: editingModel?.sqm || 0,
      description: editingModel?.description || "",
      mediaUrl: "", // Renamed from imageUrl to mediaUrl for generic use
    },
  });

  // Reset form when editing model changes
  useEffect(() => {
    if (editingModel) {
      form.reset({
        name: editingModel.name,
        price: editingModel.price,
        sqm: editingModel.sqm,
        description: editingModel.description,
        mediaUrl: "",
      });
    } else {
      form.reset({
        name: "",
        price: 0,
        sqm: 0,
        description: "",
        mediaUrl: "",
      });
    }
  }, [editingModel, form]);

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
          onAddMedia({ url, type: 'image' });
        }
      });
    } else if (mediaUrl) {
      onAddMedia({ url: mediaUrl, type: 'image' });
    }

    form.setValue("mediaUrl", "");
    setSelectedImageFiles([]);
    setImagePreviews([]);
    toast.success(`${selectedImageFiles.length || (mediaUrl ? 1 : 0)} média(s) ajouté(s) à la galerie`);
  };


  const handleSubmit = (data: Partial<HomeModel>) => {
    onSubmit(data).then(() => {
      onReset();
      form.reset();
    });
  };

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">
        {editingModel ? 'Modifier le modèle' : 'Ajouter un modèle'}
      </h2>
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom du modèle" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix (€)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Prix" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sqm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Surface (m²)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Surface" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>



              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Description détaillée du modèle" 
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
                          onClick={() => onRemoveMedia(index)}
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
                  onClick={onReset}
                >
                  Annuler
                </Button>
                <Button type="submit">
                  {editingModel ? 'Mettre à jour' : 'Ajouter'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeModelForm;
