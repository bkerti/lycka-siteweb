import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = '/api';

export interface MediaComment {
  id: string;
  media_id: string;
  comment_text: string;
  author_name: string;
  created_at: string;
}

export interface MediaReaction {
  type: string;
  count: number;
  userHasReacted?: boolean;
}

export interface MediaInteractions {
  id: string;
  reactions: Record<string, MediaReaction>;
  comments: MediaComment[];
}

const fetchInteractions = async (mediaId: string): Promise<MediaInteractions> => {
  const response = await fetch(`${API_URL}/media/${mediaId}/interactions`);
  if (!response.ok) {
    throw new Error('Failed to fetch interactions');
  }
  return response.json();
};

const addCommentMutation = async ({ mediaId, comment_text, author_name }: { mediaId: string; comment_text: string; author_name: string }) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/media/${mediaId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ comment_text, author_name }),
  });
  if (!response.ok) {
    throw new Error('Failed to post comment');
  }
  return response.json();
};

const removeCommentMutation = async ({ mediaId, commentId }: { mediaId: string; commentId: string }) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/media/${mediaId}/comments/${commentId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete comment');
  }
};

const toggleReactionMutation = async ({ mediaId, reaction_type }: { mediaId: string; reaction_type: string }) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/media/${mediaId}/reactions`, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ reaction_type }),
  });
  if (!response.ok) {
    throw new Error('Failed to toggle reaction');
  }
  return response.json();
};

export const useMediaInteractions = (mediaId: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<MediaInteractions, Error>({
    queryKey: ['interactions', mediaId],
    queryFn: () => fetchInteractions(mediaId),
    enabled: !!mediaId,
  });

  const addComment = useMutation({
    mutationFn: addCommentMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interactions', mediaId] });
    },
  });

  const removeComment = useMutation({
    mutationFn: removeCommentMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interactions', mediaId] });
    },
  });

  const toggleReaction = useMutation({
    mutationFn: toggleReactionMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interactions', mediaId] });
    },
  });

  return {
    comments: data?.comments || [],
    reactions: data?.reactions || {},
    isLoading,
    error,
    addComment: addComment.mutate,
    removeComment: removeComment.mutate,
    toggleReaction: toggleReaction.mutate,
  };
};