import React, { useState } from 'react';
import { FormField, ValidationType } from '../../models/field';
import {
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Chip,
  Box,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getDefaultValidationMessage } from '../../utils/validation';

interface FieldConfiguratorProps {
  field: FormField; // Current field data
  onUpdate: (updatedField: FormField) => void; // Pass updated field back
}

export interface ValidationRule {
  type: ValidationType;
  value?: string | number;
  message: string;
}

const FieldConfigurator: React.FC<FieldConfiguratorProps> = ({ field, onUpdate }) => {
  // State for adding a new option (for select, radio, or checkbox fields)
  const [newOption, setNewOption] = useState('');

  // State for adding a new validation
  const [newValidationType, setNewValidationType] = useState<ValidationType>(ValidationType.REQUIRED);
  const [validationValue, setValidationValue] = useState('');

  // Handle changes for label, required, etc.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;

    if (name === "required") {
      let updatedValidations = [...(field.validations || [])];

      if (checked) {
        if (!updatedValidations.some(v => v.type === ValidationType.REQUIRED)) {
          updatedValidations.push({
            type: ValidationType.REQUIRED,
            message: getDefaultValidationMessage(ValidationType.REQUIRED)
          });
        }
      } else {
        updatedValidations = updatedValidations.filter(v => v.type !== ValidationType.REQUIRED);
      }

      onUpdate({
        ...field,
        required: checked,
        validations: updatedValidations
      });
    } else {
      onUpdate({ ...field, [name]: value });
    }
  };

  // Change an option's text
  const handleOptionsChange = (index: number, value: string) => {
    const newOptions = [...(field.options || [])];
    newOptions[index] = value;
    onUpdate({ ...field, options: newOptions });
  };

  // Add a new option
  const addOption = () => {
    if (newOption.trim()) {
      onUpdate({ ...field, options: [...(field.options || []), newOption.trim()] });
      setNewOption('');
    }
  };

  // Remove an option
  const removeOption = (index: number) => {
    const newOptions = [...(field.options || [])];
    newOptions.splice(index, 1);
    onUpdate({ ...field, options: newOptions });
  };

  // Add new validation rule
  const addValidation = () => {
    const newValidation = {
      type: newValidationType,
      value: validationValue,
      message: getDefaultValidationMessage(newValidationType) // Default error message
    };
    onUpdate({ ...field, validations: [...(field.validations || []), newValidation] });
    setValidationValue('');
  };

  // Remove a validation rule
  const removeValidation = (index: number) => {
    const newValidations = [...(field.validations || [])];
    newValidations.splice(index, 1);
    onUpdate({ ...field, validations: newValidations });
  };

  // Update a validation rule
  const updateValidation = (index: number, updates: Partial<ValidationRule>) => {
    const newValidations = [...(field.validations || [])];
    newValidations[index] = { ...newValidations[index], ...updates };
    onUpdate({ ...field, validations: newValidations });
  };

  // Toggle derived field mode
  const toggleDerivedField = () => {
    onUpdate({
      ...field,
      isDerived: !field.isDerived,
      parentFields: !field.isDerived ? [] : undefined,
      derivationLogic: !field.isDerived ? '' : undefined
    });
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>Field Configuration</Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        {/* Field label */}
        <Box>
          <TextField
            name="label"
            label="Label"
            value={field.label}
            onChange={handleChange}
            fullWidth
          />
        </Box>

        {/* Required toggle */}
        <Box>
          <FormControlLabel
            control={
              <Switch
                name="required"
                checked={field.required}
                onChange={handleChange}
              />
            }
            label="Required"
          />
        </Box>

        {/* Options for select/radio/checkbox */}
        {['select', 'radio', 'checkbox'].includes(field.type) && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>Options</Typography>
            {field.options?.map((option, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TextField
                  value={option}
                  onChange={(e) => handleOptionsChange(index, e.target.value)}
                  fullWidth
                  size="small"
                />
                <Button onClick={() => removeOption(index)} color="error" sx={{ ml: 1 }}>
                  Remove
                </Button>
              </Box>
            ))}
            {/* Add new option input */}
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TextField
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                label="New option"
                fullWidth
                size="small"
              />
              <Button onClick={addOption} startIcon={<AddIcon />} sx={{ ml: 1 }}>
                Add
              </Button>
            </Box>
          </Box>
        )}

        {/* Validation rules */}
        <Box>
          <Typography variant="subtitle1" gutterBottom>Validations</Typography>
          {field.validations?.map((validation, index) => (
            <Box key={index} sx={{ mb: 2, p: 1, border: '1px solid #eee', borderRadius: 1 }}>
              {/* Validation Type Display */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Chip label={validation.type} />
                <Button size="small" onClick={() => removeValidation(index)} color="error">
                  Remove
                </Button>
              </Box>

              {['minLength', 'maxLength', 'min', 'max'].includes(validation.type) && (
                <TextField
                  label="Value"
                  type="number"
                  value={validation.value || ''}
                  onChange={(e) => updateValidation(index, { value: e.target.value })}
                  fullWidth
                  size="small"
                  sx={{ mb: 1 }}
                />
              )}

              <TextField
                label="Error message"
                value={validation.message}
                onChange={(e) => updateValidation(index, { message: e.target.value })}
                fullWidth
                size="small"
              />
            </Box>
          ))}

          {/* Add validation */}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <FormControl sx={{ minWidth: 120, mr: 1 }} size="small">
              <InputLabel>Validation Type</InputLabel>
              <Select
                value={newValidationType}
                onChange={(e) => setNewValidationType(e.target.value as ValidationType)}
                label="Validation Type"
              >
                {Object.values(ValidationType).map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {['minLength', 'maxLength', 'min', 'max'].includes(newValidationType) && (
              <TextField
                label="Value"
                type="number"
                value={validationValue}
                onChange={(e) => setValidationValue(e.target.value)}
                size="small"
                sx={{ mr: 1, width: 100 }}
              />
            )}

            <Button onClick={addValidation} startIcon={<AddIcon />}>
              Add Validation
            </Button>
          </Box>
        </Box>

        {/* Derived field toggle */}
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={field.isDerived || false}
                onChange={toggleDerivedField}
              />
            }
            label="Derived Field"
          />
        </Box>

        {/* Derivation logic input */}
        {field.isDerived && (
          <Box>
            <TextField
              label="Derivation Logic"
              value={field.derivationLogic || ''}
              onChange={(e) => onUpdate({ ...field, derivationLogic: e.target.value })}
              fullWidth
              multiline
              rows={3}
              placeholder="Example: ageFromDOB"
            />
          </Box>
        )}
      </Box>
    </div>
  );
};

export default FieldConfigurator;
