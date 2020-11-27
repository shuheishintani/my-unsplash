import { useState } from 'react';
import { useQuery } from 'react-query';
import { FormDialog } from '@/components/FormDialog';
import { Photo } from '@/types';
import { Button } from '@material-ui/core';

async function fetchPhotos() {
  const response = await fetch('/api/photos');
  const data = await response.json();
  const { photos } = data;
  return photos;
}

const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

export default function Home() {
  const [open, setOpen] = useState<boolean>(false);
  const { status, data: photos, error } = useQuery('photos', fetchPhotos);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'error') {
    if (isError(error)) {
      console.log(error.message);
    }
  }
  return (
    <>
      <Button onClick={() => setOpen(true)} variant="contained" color="primary">
        Add a Photo
      </Button>
      <FormDialog open={open} setOpen={setOpen} />
      {photos &&
        photos.map((photo: Photo) => (
          <p key={photo.id}>
            {photo.label}
            {photo.url}
          </p>
        ))}
    </>
  );
}
