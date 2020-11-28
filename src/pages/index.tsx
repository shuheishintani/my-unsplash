import { useState } from 'react';
import { useQuery } from 'react-query';
import { FormDialog } from '@/components/FormDialog';
import { SearchBar } from '@/components/SearchBar';
import { Photo } from '@/types';
import { Button, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Masonry from 'react-masonry-component';

const fetchPhotos: (key: string, keyword: string) => Promise<Photo[]> = async (
  _key,
  keyword
) => {
  const response = await fetch(`/api/photos?keyword=${keyword}`);
  const data = await response.json();
  const { photos } = data;
  return photos;
};

const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

const useStyles = makeStyles({
  img: { borderRadius: '16px' },
});

export default function Home() {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>('');
  const { status, data: photos, error } = useQuery(
    ['photos', keyword],
    fetchPhotos
  );

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
      <SearchBar setKeyword={setKeyword} />
      <Button onClick={() => setOpen(true)} variant="contained" color="primary">
        Add a Photo
      </Button>
      <FormDialog open={open} setOpen={setOpen} />
      {photos && (
        <Masonry>
          {photos.map(photo => (
            <Box key={photo.id} className="item" m={2}>
              <img src={photo.url} width="400px" className={classes.img} />
            </Box>
          ))}
        </Masonry>
      )}
    </>
  );
}
