import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { loadForms } from '../../store/formBuilderSlice';
import { deleteForm } from '../../services/formStorage';
import { 
  Container, 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Button, 
  IconButton,
  Paper,
  Box,
  ListItemButton
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const MyFormsPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { forms } = useSelector((state: RootState) => state.formBuilder);

  useEffect(() => {
    dispatch(loadForms());
  }, [dispatch]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this form?')) {
      deleteForm(id);
      dispatch(loadForms());
    }
  };

  if (forms.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>No forms found</Typography>
        <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
          You haven't created any forms yet. Start by creating a new form.
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/create')}
        >
          Create New Form
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">My Forms</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/create')}
        >
          New Form
        </Button>
      </Box>
      
      <Paper elevation={3}>
        <List>
          {forms.map(form => (
            <ListItem 
              key={form.id}
              secondaryAction={
                <IconButton 
                  edge="end" 
                  onClick={(e) => handleDelete(form.id, e)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              }
              disablePadding
            >
              <ListItemButton 
                component={Link} 
                to={`/preview/${form.id}`}
              >
                <ListItemText
                  primary={form.name}
                  secondary={`Created: ${new Date(form.createdAt).toLocaleDateString()} - ${form.fields.length} fields`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default MyFormsPage;