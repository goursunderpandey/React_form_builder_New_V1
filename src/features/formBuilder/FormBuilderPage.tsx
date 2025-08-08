import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../../store/store';
import { 
  addField, 
  updateField, 
  removeField, 
  reorderFields, 
  saveCurrentForm,
  setCurrentForm,
  resetCurrentForm,
  setFormName
} from '../../store/formBuilderSlice';
import { getFormById } from '../../services/formStorage';
import { 
  Container, 
  Grid, 
  Typography, 
  Button, 
  Box, 
  Paper,
  GridSize
} from '@mui/material';
import FieldList from '../../components/form-builder/FieldList';
import FieldConfigurator from '../../components/form-builder/FieldConfigurator';
import SaveFormDialog from '../../components/form-builder/SaveFormDialog';
import { FieldType } from '../../models/field';

const FormBuilderPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { formId } = useParams();
  const { currentForm } = useSelector((state: RootState) => state.formBuilder);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  useEffect(() => {
    if (formId) {
      const form = getFormById(formId);
      if (form) {
        dispatch(setCurrentForm(form));
        if (form.fields.length > 0) {
          setSelectedFieldId(form.fields[0].id);
        }
      }
    } else {
      dispatch(resetCurrentForm());
    }
  }, [formId, dispatch]);

  const selectedField = currentForm.fields.find(f => f.id === selectedFieldId) || null;

  const handleAddField = (type: FieldType) => {
    dispatch(addField({ type }));
    if (currentForm.fields.length === 0) {
      setSelectedFieldId(currentForm.fields[0]?.id || null);
    }
  };

  const handleFieldSelect = (fieldId: string) => {
    setSelectedFieldId(fieldId);
  };

  const handleFieldUpdate = (updatedField: any) => {
    dispatch(updateField(updatedField));
  };

  const handleFieldRemove = (fieldId: string) => {
    dispatch(removeField(fieldId));
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(currentForm.fields.length > 1 ? currentForm.fields[0].id : null);
    }
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    dispatch(reorderFields({ fromIndex, toIndex }));
  };

  const handleSaveForm = (name: string) => {
    dispatch(setFormName(name));
    dispatch(saveCurrentForm());
    setSaveDialogOpen(false);
    navigate('/myforms');
  };



  // Correct way to type grid item props
  interface GridItemProps {
    xs?: GridSize;
    sm?: GridSize;
    md?: GridSize;
    lg?: GridSize;
    xl?: GridSize;
  }
  
  const gridItemProps: GridItemProps = {
    xs: 12,
    sm: 4
  };
  
  const gridItemMainProps: GridItemProps = {
    xs: 12,
    sm: 8
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {formId ? 'Edit Form' : 'Create New Form'}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid {...gridItemProps}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Fields</Typography>
            <FieldList 
              fields={currentForm.fields} 
              selectedFieldId={selectedFieldId}
              onSelect={handleFieldSelect}
              onRemove={handleFieldRemove}
              
            />
            
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Button variant="outlined" onClick={() => handleAddField(FieldType.TEXT)}>Text</Button>
              <Button variant="outlined" onClick={() => handleAddField(FieldType.NUMBER)}>Number</Button>
              <Button variant="outlined" onClick={() => handleAddField(FieldType.TEXTAREA)}>Textarea</Button>
              <Button variant="outlined" onClick={() => handleAddField(FieldType.SELECT)}>Select</Button>
              <Button variant="outlined" onClick={() => handleAddField(FieldType.RADIO)}>Radio</Button>
              <Button variant="outlined" onClick={() => handleAddField(FieldType.CHECKBOX)}>Checkbox</Button>
              <Button variant="outlined" onClick={() => handleAddField(FieldType.DATE)}>Date</Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid {...gridItemMainProps}>
          <Paper elevation={3} sx={{ p: 2, minHeight: '500px' }}>
            {selectedField ? (
              <FieldConfigurator 
                field={selectedField} 
                onUpdate={handleFieldUpdate} 
              />
            ) : (
              <Typography variant="body1" color="textSecondary">
                {currentForm.fields.length === 0 
                  ? 'Add a field to get started' 
                  : 'Select a field to configure'}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => setSaveDialogOpen(true)}
          disabled={currentForm.fields.length === 0}
        >
          Save Form
        </Button>
      </Box>
      
      <SaveFormDialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        onSave={handleSaveForm}
        defaultName={currentForm.name}
      />
    </Container>
  );
};

export default FormBuilderPage;