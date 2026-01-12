
import imageCompression from 'browser-image-compression';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

const LyckaBlogForm = ({ item, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<{ url: string; type: string }[]>([]);
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (item) {
      setTitle(item.title || '');
      setContent(item.content || '');
      setMedia(item.media || []);
    } else {
      setTitle('');
      setContent('');
      setMedia([]);
    }
  }, [item]);

  const handleSave = () => {
    onSave({ ...item, title, content, media });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const uploadFile = async (file: File) => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      toast.error("Authentification requise pour l'upload.");
      return null;
    }

    const endpoint = `/api/upload?filename=${file.name}`;

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
      return data.url; // Vercel Blob returns 'url'
    } catch (error) {
      console.error(`Error uploading file:`, error);
      toast.error(`Échec du téléchargement du fichier : ${file.name}`);
      return null;
    }
  };

  const handleAddMedia = async () => {
    if (selectedImageFiles.length === 0) {
      return;
    }

    toast.info('Compression des images en cours...');

    try {
      const compressionOptions = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressionPromises = selectedImageFiles.map(file => 
        imageCompression(file, compressionOptions)
      );
      const compressedFiles = await Promise.all(compressionPromises);
      
      toast.info('Téléversement des images compressées...');

      const uploadPromises = compressedFiles.map(file => uploadFile(file));
      const urls = await Promise.all(uploadPromises);
      
      const uploadedUrls = urls.filter(url => url).map(url => ({ url, type: 'image' }));

      if (uploadedUrls.length > 0) {
        setMedia(prevMedia => [...prevMedia, ...uploadedUrls]);
        setSelectedImageFiles([]);
        imagePreviews.forEach(p => URL.revokeObjectURL(p));
        setImagePreviews([]);
        toast.success(`${uploadedUrls.length} média(s) ajouté(s) avec succès.`);
      } else {
        toast.error("Le téléversement des images a échoué après la compression.");
      }
    } catch (error) {
      console.error("Erreur lors de la compression ou du téléversement:", error);
      toast.error("Une erreur s'est produite lors de la compression ou du téléversement.");
    }
  };

  const removeMediaFromGallery = (index: number) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">{item ? 'Modifier l\'article' : 'Ajouter un article'}</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Titre</label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Contenu</label>
          <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={10} />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Images</label>
          <div className="flex flex-wrap gap-2">
            {media.map((mediaItem, index) => (
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
          <Input id="image" type="file" multiple onChange={handleFileChange} className="mt-2"/>
          <div className="flex gap-2 mt-2">
            {imagePreviews.map((preview, index) => (
              <img key={index} src={preview} alt={`Preview ${index + 1}`} className="w-16 h-16 object-cover rounded" />
            ))}
          </div>
          <Button type="button" onClick={handleAddMedia} className="mt-2">Ajouter les images</Button>
        </div>
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="outline" onClick={onCancel}>Annuler</Button>
        <Button onClick={handleSave}>Enregistrer</Button>
      </div>
    </div>
  );
};

export default LyckaBlogForm;
