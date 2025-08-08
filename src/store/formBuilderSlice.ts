import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormField, FormSchema, FieldType, defaultFieldConfig } from '../models/field';
import { saveForm, getForms, getFormById } from '../services/formStorage';

interface FormBuilderState {
  currentForm: {
    name: string;
    fields: FormField[];
  };
  forms: FormSchema[];
}

const initialState: FormBuilderState = {
  currentForm: {
    name: '',
    fields: []
  },
  forms: getForms()
};

export const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    resetCurrentForm: (state) => {
      state.currentForm = {
        name: '',
        fields: []
      };
    },
    setCurrentForm: (state, action: PayloadAction<FormSchema>) => {
      state.currentForm = {
        name: action.payload.name,
        fields: [...action.payload.fields]
      };
    },
    setFormName: (state, action: PayloadAction<string>) => {
      state.currentForm.name = action.payload;
    },
    addField: (state, action: PayloadAction<{ type: FieldType }>) => {
      const newField: FormField = {
        id: Date.now().toString(),
        type: action.payload.type,
        label: `Field ${state.currentForm.fields.length + 1}`,
        required: false, // explicitly set required
        ...defaultFieldConfig,
        options: action.payload.type === 'select' || action.payload.type === 'radio' 
          ? ['Option 1', 'Option 2'] 
          : undefined
      };
      state.currentForm.fields.push(newField);
    },
    updateField: (state, action: PayloadAction<FormField>) => {
      const index = state.currentForm.fields.findIndex(f => f.id === action.payload.id);
      if (index >= 0) {
        state.currentForm.fields[index] = action.payload;
      }
    },
    removeField: (state, action: PayloadAction<string>) => {
      state.currentForm.fields = state.currentForm.fields.filter(f => f.id !== action.payload);
    },
    reorderFields: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload;
      const [removed] = state.currentForm.fields.splice(fromIndex, 1);
      state.currentForm.fields.splice(toIndex, 0, removed);
    },
    saveCurrentForm: (state) => {
      if (state.currentForm.name && state.currentForm.fields.length > 0) {
        const savedForm = saveForm(state.currentForm);
        state.forms.push(savedForm);
      }
    },
    loadForms: (state) => {
      state.forms = getForms();
    }
  }
});

export const {
  resetCurrentForm,
  setCurrentForm,
  setFormName,
  addField,
  updateField,
  removeField,
  reorderFields,
  saveCurrentForm,
  loadForms
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;