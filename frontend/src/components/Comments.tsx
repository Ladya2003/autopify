import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import commentsService from '../services/api/commentsService';

const Comments = ({ carId }: { carId: string }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoading(true);
        const fetchedComments = await commentsService.fetchComments(carId);
        setComments(fetchedComments);
      } catch (error) {
        console.error('Failed to load comments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [carId]);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const addedComment = await commentsService.addComment(
          carId,
          newComment,
        );
        // TODO: fix that
        // setComments([...comments, addedComment]);
        setNewComment('');
      } catch (error) {
        console.error('Failed to add comment:', error);
      }
    }
  };

  return (
    <Box>
      <Typography variant="h6">Comments</Typography>
      {loading ? (
        <Typography variant="body1">Loading comments...</Typography>
      ) : (
        <List>
          {comments.map((comment, index) => (
            <ListItem key={index}>
              {/* TODO: fix that */}
              {/* <ListItemText primary={comment.text} /> */}
            </ListItem>
          ))}
        </List>
      )}
      <Box display="flex" alignItems="center" mt={2}>
        <TextField
          fullWidth
          label="Add a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button
          onClick={handleAddComment}
          variant="contained"
          color="primary"
          style={{ marginLeft: '10px' }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default Comments;
