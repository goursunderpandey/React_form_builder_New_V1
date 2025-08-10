import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../../store/store';
import { setCurrentForm } from '../../store/formBuilderSlice';
import { getFormById } from '../../services/formStorage';
import { Container, Typography, Button } from '@mui/material';
import FormRenderer from '../../preview/FormRenderer';
import { useNavigate } from 'react-router-dom';
import {

  Box,

} from '@mui/material';

const FormPreviewPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { formId } = useParams();
  const { currentForm } = useSelector((state: RootState) => state.formBuilder);

  useEffect(() => {
    if (formId) {
      const form = getFormById(formId);
      if (form) {
        dispatch(setCurrentForm(form));
      }
    }
  }, [formId, dispatch]);

  if (!currentForm.fields.length) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>Form not found</Typography>
        <Button variant="contained" onClick={() => navigate('/create')}>
          Create New Form
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>{currentForm.name}</Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Form Preview
      </Typography>

      <FormRenderer fields={currentForm.fields} />

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={() => navigate('/myforms')}
          sx={{ mb: 2 }}
        >
          Back to My Forms
        </Button>
      </Box>
    </Container>
  );
};

export default FormPreviewPage;