import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

interface SaveFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  defaultName?: string;
}

const SaveFormDialog: React.FC<SaveFormDialogProps> = ({ 
  open, 
  onClose, 
  onSave,
  defaultName = ''
}) => {
  const [name, setName] = React.useState(defaultName);

  React.useEffect(() => {
    if (open) {
      setName(defaultName);
    }
  }, [open, defaultName]);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Save Form</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Form Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary" disabled={!name.trim()}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveFormDialog;