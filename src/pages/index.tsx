import { useState } from 'react';
import { useQuery } from 'react-query';
import { FormDialog } from '@/components/FormDialog';
import { Photo } from '@/types';
import { Button, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Masonry from 'react-masonry-component';

async function fetchPhotos() {
  const response = await fetch('/api/photos');
  const data = await response.json();
  const { photos } = data;
  return photos;
}

const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

const useStyles = makeStyles({
  img: { borderRadius: '16px' },
});

export default function Home() {
  const classes = useStyles();
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
      {photos && (
        <Masonry>
          {photos.map((photo: Photo) => (
            <Box key={photo.id} className="item" m={2}>
              <img src={photo.url} width="400px" className={classes.img} />
            </Box>
          ))}
        </Masonry>
      )}
    </>
  );
}
