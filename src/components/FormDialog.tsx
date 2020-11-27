import React from 'react';
import { useMutation, queryCache } from 'react-query';
import { Photo } from '@/types';
import { PhotoDto } from '@/dto';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';

async function createPhoto({ label, url }: PhotoDto) {
  const response = await fetch('/api/photos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ label, url }),
  });
  const data = await response.json();
  const { photo } = data;
  return photo;
}

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const FormDialog: React.FC<Props> = ({ open, setOpen }) => {
  console.log('hoge');
  const [label, setLabel] = React.useState<string>('');
  const [url, setUrl] = React.useState<string>('');
  const [mutate] = useMutation(createPhoto, {
    onMutate: photoData => {
      queryCache.cancelQueries('all');

      const prevPhotos: Photo[] | undefined = queryCache.getQueryData('photos');

      if (prevPhotos) {
        queryCache.setQueryData<Photo[]>('photos', [
          {
            id: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            ...photoData,
          },
          ...prevPhotos,
        ]);
      }

      return () => queryCache.setQueryData('photos', prevPhotos);
    },
    onError: (_error, _photoData, rollback: () => void) => rollback(),
    onSuccess: () => {
      queryCache.invalidateQueries('photos');
    },
  });

  const handleClose = (): void => {
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
