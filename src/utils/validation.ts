import { ValidationType, ValidationRule } from '../models/field';

export const validateField = (value: any, validations: ValidationRule[] = []): string | null => {
  for (const validation of validations) {
    switch (validation.type) {
      case ValidationType.REQUIRED:
        if (value === undefined || value === null || value === '') return validation.message;
        break;
      case ValidationType.MIN_LENGTH:
        if (String(value).length < Number(validation.value)) return validation.message;
        break;
      case ValidationType.MAX_LENGTH:
        if (String(value).length > Number(validation.value)) return validation.message;
        break;
      case ValidationType.EMAIL:
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return validation.message;
        break;
      case ValidationType.PASSWORD:
        if (String(value).length < 8 || !/\d/.test(value)) return validation.message;
        break;
      case ValidationType.MIN:
        if (Number(value) < Number(validation.value)) return validation.message;
        break;
      case ValidationType.MAX:
        if (Number(value) > Number(validation.value)) return validation.message;
        break;
    }
  }
  return null;
};

export const getDefaultValidationMessage = (type: ValidationType): string => {
  switch (type) {
    case ValidationType.REQUIRED: return 'This field is required';
    case ValidationType.MIN_LENGTH: return 'Value is too short';
    case ValidationType.MAX_LENGTH: return 'Value is too long';
    case ValidationType.EMAIL: return 'Invalid email format';
    case ValidationType.PASSWORD: return 'Password must be at least 8 characters and contain a number';
    case ValidationType.MIN: return 'Value is too small';
    case ValidationType.MAX: return 'Value is too large';
    default: return 'Invalid value';
  }
};