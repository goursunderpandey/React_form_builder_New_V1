import React, { useState } from 'react';
import { FormField, FieldType } from '../../src/models/field';
import {
    TextField,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Checkbox,
    Select,
    MenuItem,
    InputLabel,
    Button,
    Typography,
    Box
} from '@mui/material';
import { validateField } from '../../src/utils/validation';
import { calculateDerivedValue } from '../../src/utils/derivedFields';

// Props interface for the component
interface FormRendererProps {
    fields: FormField[];
}

const FormRenderer: React.FC<FormRendererProps> = ({ fields }) => {
    // State for form data
    const [formData, setFormData] = useState<Record<string, any>>({});
    // State for field errors
    const [errors, setErrors] = useState<Record<string, string | null>>({});
    // State for tracking touched fields (used for validation display)
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    /**
     * Handles field value changes.
     * Supports both normal fields and checkbox multi-select logic.
     */
    const handleChange = (
        fieldId: string,
        value: boolean | string,
        isCheckbox?: boolean,
        option?: string
    ) => {
        // Update form data
        setFormData(prev => {
            if (isCheckbox) {
                // Ensure current value is an array
                const currentValues: string[] = Array.isArray(prev[fieldId]) ? prev[fieldId] as string[] : [];
                let updatedValues: string[];

                // Add or remove the checkbox value
                if (value) {
                    updatedValues = [...currentValues, option as string];
                } else {
                    updatedValues = currentValues.filter((v: string) => v !== option);
                }

                return { ...prev, [fieldId]: updatedValues };
            }
            return { ...prev, [fieldId]: value };
        });

        // Mark the field as touched
        setTouched(prev => ({ ...prev, [fieldId]: true }));

        // Validate the updated value
        const field = fields.find(f => f.id === fieldId);
        if (field && !field.isDerived) {
            const valToValidate = isCheckbox
                ? ((formData[fieldId] as string[]) || [])
                      .concat(value ? [option as string] : [])
                      .filter((v: string, i: number, arr: string[]) => arr.indexOf(v) === i)
                : value;

            const error = validateField(valToValidate, field.validations);
            setErrors(prev => ({ ...prev, [fieldId]: error }));
        }
    };

    /**
     * Handles blur events — marks field as touched.
     */
    const handleBlur = (fieldId: string) => {
        setTouched(prev => ({ ...prev, [fieldId]: true }));
    };

    /**
     * Handles form submission.
     * Validates all fields before allowing submission.
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Record<string, string | null> = {};
        let isValid = true;

        // Mark all fields as touched for full validation
        const allTouched: Record<string, boolean> = {};
        fields.forEach(field => { allTouched[field.id] = true; });
        setTouched(allTouched);

        // Validate each field
        fields.forEach(field => {
            if (!field.isDerived) {
                const value = field.type === FieldType.CHECKBOX
                    ? formData[field.id] || []
                    : formData[field.id];
                const error = validateField(value, field.validations);
                newErrors[field.id] = error;
                if (error) isValid = false;
            }
        });

        setErrors(newErrors);

        // Submit or show errors
        if (isValid) {
            alert('Form submitted successfully!');
        } else {
            alert('Please fix the errors in the form.');
        }
    };

    /**
     * Renders individual form fields based on type.
     */
    const renderField = (field: FormField) => {
        // Handle derived fields (read-only computed values)
        if (field.isDerived) {
            const derivedValue = calculateDerivedValue(field, formData);
            return (
                <TextField
                    label={field.label}
                    value={derivedValue || ''}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                />
            );
        }

        const error = errors[field.id];
        const isTouched = touched[field.id];

        // Render fields depending on type
        switch (field.type) {
            case FieldType.TEXT:
            case FieldType.NUMBER:
            case FieldType.TEXTAREA:
            case FieldType.DATE:
                return (
                    <TextField
                        label={field.label}
                        type={field.type === FieldType.DATE ? 'date' : field.type}
                        value={formData[field.id] || field.defaultValue || ''}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        onBlur={() => handleBlur(field.id)}
                        fullWidth
                        margin="normal"
                        error={isTouched && !!error}
                        helperText={isTouched && error}
                        multiline={field.type === FieldType.TEXTAREA}
                        rows={field.type === FieldType.TEXTAREA ? 4 : undefined}
                        InputLabelProps={field.type === FieldType.DATE ? { shrink: true } : undefined}
                    />
                );

            case FieldType.SELECT:
                return (
                    <FormControl fullWidth margin="normal" error={isTouched && !!error}>
                        <InputLabel>{field.label}</InputLabel>
                        <Select
                            value={formData[field.id] || field.defaultValue || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            onBlur={() => handleBlur(field.id)}
                        >
                            {field.options?.map((option, index) => (
                                <MenuItem key={index} value={option}>{option}</MenuItem>
                            ))}
                        </Select>
                        {isTouched && error && (
                            <Typography variant="caption" color="error">{error}</Typography>
                        )}
                    </FormControl>
                );

            case FieldType.RADIO:
                return (
                    <FormControl component="fieldset" fullWidth margin="normal" error={isTouched && !!error}>
                        <FormLabel component="legend">{field.label}</FormLabel>
                        <RadioGroup
                            value={formData[field.id] || field.defaultValue || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                        >
                            {field.options?.map((option, index) => (
                                <FormControlLabel
                                    key={index}
                                    value={option}
                                    control={<Radio />}
                                    label={option}
                                />
                            ))}
                        </RadioGroup>
                        {isTouched && error && (
                            <Typography variant="caption" color="error">{error}</Typography>
                        )}
                    </FormControl>
                );

            case FieldType.CHECKBOX:
                return (
                    <FormControl component="fieldset" fullWidth margin="normal" error={isTouched && !!error}>
                        <FormLabel component="legend">{field.label}</FormLabel>
                        {field.options?.map((option, index) => (
                            <FormControlLabel
                                key={index}
                                control={
                                    <Checkbox
                                        sx={{ color: 'black', '&.Mui-checked': { color: 'black' } }}
                                        checked={(formData[field.id] || []).includes(option)}
                                        onChange={(e) => handleChange(field.id, e.target.checked, true, option)}
                                        onBlur={() => handleBlur(field.id)}
                                    />
                                }
                                label={option}
                            />
                        ))}
                        {isTouched && error && (
                            <Typography variant="caption" color="error">{error}</Typography>
                        )}
                    </FormControl>
                );

            default:
                return null;
        }
    };

    // Main render
    return (
        <form onSubmit={handleSubmit}>
            {fields.map(field => (
                <Box key={field.id} mb={3}>
                    {renderField(field)}
                </Box>
            ))}

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="contained" color="primary">
                    Submit
                </Button>
            </Box>
        </form>
    );
};

export default FormRenderer;
