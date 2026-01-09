import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const QuizForm = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    type: 'quiz',
    title: '',
    content: '', // For the JSON data
  });

  useEffect(() => {
    if (item) {
      setFormData({
        type: 'quiz',
        title: item.title || '',
        content: item.content || '',
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
        <h2 className="text-2xl font-bold">{item ? 'Modifier le quiz' : 'Ajouter un quiz'}</h2>
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
            <label htmlFor="content">Données du Quiz (JSON)</label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder='{ "question": "...", "options": ["...", "..."] }'
              rows={8}
            />
        </div>
        <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
            <Button type="submit">Sauvegarder</Button>
        </div>
    </form>
  );
};

export default QuizForm;
