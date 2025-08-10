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

  // Get the list of forms from Redux store
  const { forms } = useSelector((state: RootState) => state.formBuilder);

  // Load all saved forms when the component mounts
  useEffect(() => {
    dispatch(loadForms());
  }, [dispatch]);

  /**
   * Handle deletion of a form
   * @param id - ID of the form to delete
   * @param e - Click event to stop navigation
   */
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    e.preventDefault();

    // Ask user for confirmation before deleting
    if (window.confirm('Are you sure you want to delete this form?')) {
      deleteForm(id); // Remove form from storage
      dispatch(loadForms()); // Refresh list
    }
  };

  // If no forms exist, display a message with a "Create New Form" button
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
      {/* Page title and "New Form" button */}
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
      
      {/* Forms list */}
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
