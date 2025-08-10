import React from 'react';
import { FormField } from '../../models/field';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
interface FieldListProps {
  fields: FormField[];
  selectedFieldId: string | null;
  onSelect: (fieldId: string) => void;
  onRemove: (fieldId: string) => void;
}

const FieldList: React.FC<FieldListProps> = ({
  fields,
  selectedFieldId,
  onSelect,
  onRemove
}) => {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {fields.map((field) => (
        <li
          key={field.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px',
            backgroundColor: field.id === selectedFieldId ? '#e0f7fa' : '#fff',
            borderBottom: '1px solid #ccc',
            cursor: 'pointer',
          }}
          onClick={() => onSelect(field.id)}
        >
          <div>
            <strong>{field.label || `Unnamed ${field.type} field`}</strong>
            <div style={{ fontSize: '0.9em', color: '#666' }}>{field.type}</div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent triggering onSelect
              onRemove(field.id);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'red',
              cursor: 'pointer',
              fontSize: '1.2em',
            }}
            title="Delete"
          >
            <DeleteOutlineIcon fontSize="small" />
          </button>


          
        </li>
      ))}
    </ul>
  );
};

export default FieldList;
