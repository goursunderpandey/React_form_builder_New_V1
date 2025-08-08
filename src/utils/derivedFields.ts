import { FormField } from '../models/field';

export const calculateDerivedValue = (field: FormField, formData: Record<string, any>): any => {
  if (!field.isDerived || !field.parentFields || !field.derivationLogic) return null;
  
  try {
    // Get parent values
    const parentValues = field.parentFields.map(parentId => formData[parentId]);
    
    // Simple example: Age calculation from date of birth
    if (field.derivationLogic === 'ageFromDOB') {
      const dob = parentValues[0];
      if (!dob) return null;
      const birthDate = new Date(dob);
      const diff = Date.now() - birthDate.getTime();
      return Math.abs(new Date(diff).getUTCFullYear() - 1970);
    }
    
    // Default: return the first parent value
    return parentValues[0];
  } catch (error) {
    console.error('Derivation error:', error);
    return null;
  }
};