import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  CardMedia,
  Pagination,
} from '@mui/material';
import userService from '../../../services/api/userService';
import commentService from '../../../services/api/commentService';
import { DEFAULT_AVATAR } from '../../../types/user';
import Header from '../../../components/layout/Header';
import { CommentType } from '../../../types/comment';

export const SellerDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [displayedComments, setDisplayedComments] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;

  useEffect(() => {
    if (id) {
      userService.fetchUser(id).then(setUser);
      commentService.fetchSellerComments(id).then(setComments);
    }
  }, [id]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * commentsPerPage;
    const endIndex = startIndex + commentsPerPage;
    setDisplayedComments(comments.slice(startIndex, endIndex));
  }, [currentPage, comments]);

  const handleAddComment = async () => {
    if (!newComment) return;

    try {
      const createdComment = await commentService.createSellerComment(id!, {
        text: newComment,
        status: CommentType.Seller,
      });
      setComments([createdComment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (!user) {
    return (
      <Box p={5} textAlign="center">
        <Typography variant="h4">Загрузка...</Typography>
      </Box>
    );
  }

  return (
    <Header
      title={`Страница ${user.nickname || user.email || 'продавца'}`}
      action={{}}
      shouldDisplayLogin
    >
      <Box p={5} textAlign="center">
        <CardMedia
          component="img"
          image={user.profilePicture || DEFAULT_AVATAR}
          alt={user.nickname || user.email}
          sx={{
            margin: '0 auto',
            borderRadius: '50%',
            width: '150px',
            height: '150px',
            objectFit: 'cover',
          }}
        />
        <Typography variant="h4" sx={{ mt: 3 }}>
          {user.nickname || user.email}
        </Typography>
        <Typography variant="h6" sx={{ mt: 1 }}>
          Email: {user.email}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, whiteSpace: 'pre-line' }}>
          {user.description}
        </Typography>

        {/* Comments Section */}
        <Box mt={4}>
          <Typography variant="h6">Комментарии</Typography>

          {/* New comment */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'stretch', mt: 2 }}>
            <TextField
              fullWidth
              placeholder="Добавить комментарий..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <Button variant="contained" onClick={handleAddComment}>
              Добавить
            </Button>
          </Box>

          <List>
            {displayedComments.map((comment, idx) => (
              <ListItem key={idx}>
                <ListItemAvatar>
                  <CardMedia
                    component="img"
                    image={comment.author?.profilePicture || DEFAULT_AVATAR}
                    alt={comment.author?.nickname || comment.author?.email}
                    sx={{
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      objectFit: 'cover',
                    }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={comment.author?.nickname || comment.author?.email}
                  secondary={comment.text}
                />
              </ListItem>
            ))}
          </List>

          {displayedComments.length > 0 && (
            <Pagination
              count={Math.ceil(comments.length / commentsPerPage)}
              page={currentPage}
              onChange={(_, page) => setCurrentPage(page)}
              sx={{ mt: 2 }}
            />
          )}
        </Box>
      </Box>
    </Header>
  );
};
