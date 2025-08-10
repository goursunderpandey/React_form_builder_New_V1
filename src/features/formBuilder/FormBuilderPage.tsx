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

  // Get current form data from Redux
  const { currentForm } = useSelector((state: RootState) => state.formBuilder);

  // Local state
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null); // Currently selected field for configuration
  const [saveDialogOpen, setSaveDialogOpen] = useState(false); // Controls save form dialog visibility

  /**
   * Load form data if editing, otherwise reset to empty form
   */
  useEffect(() => {
    if (formId) {
      const form = getFormById(formId);
      if (form) {
        dispatch(setCurrentForm(form));
        if (form.fields.length > 0) {
          setSelectedFieldId(form.fields[0].id); // Auto-select first field
        }
      }
    } else {
      dispatch(resetCurrentForm());
    }
  }, [formId, dispatch]);

  // The currently selected field object
  const selectedField = currentForm.fields.find(f => f.id === selectedFieldId) || null;

  /**
   * Add a new field of given type
   */
  const handleAddField = (type: FieldType) => {
    dispatch(addField({ type }));
    // Auto-select the first field when adding the very first field
    if (currentForm.fields.length === 0) {
      setSelectedFieldId(currentForm.fields[0]?.id || null);
    }
  };

  /**
   * Select a field from the list
   */
  const handleFieldSelect = (fieldId: string) => {
    setSelectedFieldId(fieldId);
  };

  /**
   * Update field properties
   */
  const handleFieldUpdate = (updatedField: any) => {
    dispatch(updateField(updatedField));
  };

  /**
   * Remove a field from the form
   */
  const handleFieldRemove = (fieldId: string) => {
    dispatch(removeField(fieldId));
    // If removed field was selected, auto-select another or clear selection
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(currentForm.fields.length > 1 ? currentForm.fields[0].id : null);
    }
  };

  /**
   * Save form with given name
   */
  const handleSaveForm = (name: string) => {
    dispatch(setFormName(name));
    dispatch(saveCurrentForm());
    setSaveDialogOpen(false);
    navigate('/myforms'); // Redirect to forms list
  };

  // Reusable grid size props for layout
  interface GridItemProps {
    xs?: GridSize;
    sm?: GridSize;
    md?: GridSize;
    lg?: GridSize;
    xl?: GridSize;
  }

  const gridItemProps: GridItemProps = { xs: 12, sm: 4 }; // Left panel
  const gridItemMainProps: GridItemProps = { xs: 12, sm: 8 }; // Right panel

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Page title */}
      <Typography variant="h4" gutterBottom>
        {formId ? 'Edit Form' : 'Create New Form'}
      </Typography>

      <Grid container spacing={3}>
        {/* Left side: Fields list and add buttons */}
        <Grid {...gridItemProps}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Fields</Typography>

            {/* Field list component */}
            <FieldList 
              fields={currentForm.fields} 
              selectedFieldId={selectedFieldId}
              onSelect={handleFieldSelect}
              onRemove={handleFieldRemove}
            />

            {/* Field type buttons */}
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

        {/* Right side: Field configurator */}
        <Grid {...gridItemMainProps}>
          <Paper elevation={3} sx={{ p: 2, minHeight: '500px' }}>
            {selectedField ? (
              // Show configurator when a field is selected
              <FieldConfigurator 
                field={selectedField} 
                onUpdate={handleFieldUpdate} 
              />
            ) : (
              // Show helper text when no field is selected
              <Typography variant="body1" color="textSecondary">
                {currentForm.fields.length === 0 
                  ? 'Add a field to get started' 
                  : 'Select a field to configure'}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Save button */}
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

      {/* Save form dialog */}
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
