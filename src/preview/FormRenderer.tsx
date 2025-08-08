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

interface FormRendererProps {
    fields: FormField[];
}

const FormRenderer: React.FC<FormRendererProps> = ({ fields }) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string | null>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const handleChange = (fieldId: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [fieldId]: value
        }));

        setTouched(prev => ({
            ...prev,
            [fieldId]: true
        }));

        // Validate the field
        const field = fields.find(f => f.id === fieldId);
        if (field) {
            const error = validateField(value, field.validations);
            setErrors(prev => ({
                ...prev,
                [fieldId]: error
            }));
        }
    };

    const handleBlur = (fieldId: string) => {
        setTouched(prev => ({
            ...prev,
            [fieldId]: true
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields
        const newErrors: Record<string, string | null> = {};
        let isValid = true;

        fields.forEach(field => {
            if (field.required || formData[field.id] !== undefined) {
                const error = validateField(formData[field.id], field.validations);
                newErrors[field.id] = error;
                if (error) isValid = false;
            }
        });

        setErrors(newErrors);

        if (isValid) {
            alert('Form submitted successfully!');
        } else {
            alert('Please fix the errors in the form.');
        }
    };

    const renderField = (field: FormField) => {
        if (field.isDerived) {
            const derivedValue = calculateDerivedValue(field, formData);
            return (
                <TextField
                    label={field.label}
                    value={derivedValue || ''}
                    fullWidth
                    margin="normal"
                    InputProps={{
                        readOnly: true,
                    }}
                />
            );
        }

        const error = errors[field.id];
        const isTouched = touched[field.id];

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
                    <FormControl fullWidth margin="normal">
                        <InputLabel>{field.label}</InputLabel>
                        <Select
                            value={formData[field.id] || field.defaultValue || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            onBlur={() => handleBlur(field.id)}
                            label={field.label}
                            error={isTouched && !!error}
                        >
                            {field.options?.map((option: string, index: number) => (
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
                    <FormControl component="fieldset" fullWidth margin="normal">
                        <FormLabel component="legend">{field.label}</FormLabel>
                        <RadioGroup
                            value={formData[field.id] || field.defaultValue || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                        >
                            {field.options?.map((option: string, index: number) => (
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
                    <FormControl component="fieldset" fullWidth margin="normal">
                        <FormLabel component="legend">{field.label}</FormLabel>
                        {field.options?.map((option: string, index: number) => (
                            <FormControlLabel
                                key={index}
                                control={
                                    <Checkbox
                                        checked={!!formData[`${field.id}_${index}`]}
                                        onChange={(e) => handleChange(`${field.id}_${index}`, e.target.checked)}
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