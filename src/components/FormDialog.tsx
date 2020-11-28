import React from 'react';
import { useAddPhoto } from '@/hooks/useAddPhoto';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FormDialog: React.FC<Props> = ({ open, setOpen }) => {
  const [label, setLabel] = React.useState<string>('');
  const [url, setUrl] = React.useState<string>('');
  const [mutate] = useAddPhoto();
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      setOpen(false);
      await mutate({ label, url });
    } catch (e) {
      console.log(e);
    }
  };

  const handleLabelInput = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLabel(e.currentTarget.value);
    },
    []
  );

  const handleUrlInput = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUrl(e.currentTarget.value);
    },
    []
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Add a new photo</DialogTitle>
      <DialogContent>
        <TextField
          label="Label"
          variant="outlined"
          margin="dense"
          fullWidth
          onChange={handleLabelInput}
        />
        <TextField
          label="Photo URL"
          variant="outlined"
          margin="dense"
          fullWidth
          onChange={handleUrlInput}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
