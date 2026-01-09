import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CommentCard = ({ comment }) => (
  <Card className="bg-card p-4 rounded-lg shadow-sm">
    <CardHeader className="p-0 mb-2">
      <CardTitle className="font-bold text-base">{comment.author_name}</CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <p className="text-muted-foreground">{comment.comment_text}</p>
      <p className="text-xs text-muted-foreground mt-2">{new Date(comment.created_at).toLocaleString()}</p>
    </CardContent>
  </Card>
);

const MediaCommentSection = ({ mediaId }) => {
  const [comments, setComments] = useState([]);
  const [authorName, setAuthorName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Honeypot field
  const [error, setError] = useState(null);

  const fetchComments = useCallback(async () => {
    if (!mediaId) return;
    try {
      const response = await fetch(`/api/media/${mediaId}/interactions`);
      if (!response.ok) throw new Error('Failed to fetch comments.');
      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Impossible de charger les commentaires.");
    }
  }, [mediaId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authorName.trim() || !commentText.trim()) {
        alert("Veuillez renseigner votre nom et votre commentaire.");
        return;
    };

    try {
      const response = await fetch(`/api/media/${mediaId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author_name: authorName, comment_text: commentText, subject: honeypot }), // Include honeypot
      });

      if (response.ok) {
        fetchComments(); // Refresh comments
        setAuthorName("");
        setCommentText("");
      } else {
        throw new Error('Failed to submit comment.');
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Erreur lors de l'envoi du commentaire.");
    }
  };

  return (
    <section className="py-12 md:py-20 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Avis sur ce modèle</h2>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="space-y-6 mb-12 max-w-3xl mx-auto">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))
          ) : (
            <p className="text-center text-muted-foreground">Aucun avis pour le moment. Soyez le premier à en laisser un !</p>
          )}
        </div>

        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-6">Laissez votre avis</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot field - visually hidden */}
            <div className="absolute w-0 h-0 overflow-hidden">
              <label htmlFor="subject-comments">Subject</label>
              <Input
                type="text"
                id="subject-comments"
                name="subject"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                autoComplete="off"
                tabIndex={-1}
              />
            </div>

            <Input
              type="text"
              placeholder="Votre nom"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
            />
            <Textarea
              placeholder="Que pensez-vous de ce modèle ?"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">Envoyer mon avis</Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default MediaCommentSection;
