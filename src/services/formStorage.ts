import { FormSchema } from '../models/field';

const FORMS_KEY = 'formBuilderForms';

export const saveForm = (form: Omit<FormSchema, 'id' | 'createdAt'>): FormSchema => {
  const existingForms = getForms();
  const newForm: FormSchema = {
    ...form,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  const updatedForms = [...existingForms, newForm];
  localStorage.setItem(FORMS_KEY, JSON.stringify(updatedForms));
  return newForm;
};

export const getForms = (): FormSchema[] => {
  const formsJson = localStorage.getItem(FORMS_KEY);
  return formsJson ? JSON.parse(formsJson) : [];
};

export const getFormById = (id: string): FormSchema | undefined => {
  const forms = getForms();
  return forms.find(form => form.id === id);
};

export const deleteForm = (id: string): void => {
  const forms = getForms();
  const updatedForms = forms.filter(form => form.id !== id);
  localStorage.setItem(FORMS_KEY, JSON.stringify(updatedForms));
};