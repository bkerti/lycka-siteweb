import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const VideoForm = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    type: 'video',
    title: '',
    media_url: '',
  });

  useEffect(() => {
    if (item) {
      setFormData({
        type: 'video',
        title: item.title || '',
        media_url: item.media_url || '',
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4 border-t pt-8 mt-8">
        <h2 className="text-2xl font-bold">{item ? 'Modifier la vidéo' : 'Ajouter une vidéo'}</h2>
        <div>
            <label htmlFor="title">Titre</label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
        </div>
        <div>
            <label htmlFor="media_url">URL de la Vidéo</label>
            <Input
              id="media_url"
              name="media_url"
              value={formData.media_url}
              onChange={handleChange}
              placeholder="https://youtube.com/watch?v=..."
              required
            />
        </div>
        <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
            <Button type="submit">Sauvegarder</Button>
        </div>
    </form>
  );
};

export default VideoForm;
