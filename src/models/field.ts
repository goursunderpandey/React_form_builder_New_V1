export enum FieldType {
    TEXT = 'text',
    NUMBER = 'number',
    TEXTAREA = 'textarea',
    SELECT = 'select',
    RADIO = 'radio',
    CHECKBOX = 'checkbox',
    DATE = 'date'
  }
  
  export enum ValidationType {
    REQUIRED = 'required',
    MIN_LENGTH = 'minLength',
    MAX_LENGTH = 'maxLength',
    EMAIL = 'email',
    PASSWORD = 'password',
    MIN = 'min',
    MAX = 'max'
  }
  
  export interface ValidationRule {
    type: ValidationType;
    value?: string | number;
    message: string;
  }
  
  export interface FormField {
    id: string;
    type: FieldType;
    label: string;
    required?: boolean; // make it optional
    defaultValue?: string | number | boolean;
    options?: string[];
    validations?: ValidationRule[];
    isDerived?: boolean;
    parentFields?: string[];
    derivationLogic?: string;
  }
  
  export interface FormSchema {
    id: string;
    name: string;
    createdAt: string;
    fields: FormField[];
  }
  
  export const defaultFieldConfig: Omit<FormField, 'id' | 'type' | 'label'> = {
    required: false,
    validations: []
  };