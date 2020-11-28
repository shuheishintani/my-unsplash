import { useState } from 'react';
import { useQuery, useMutation, queryCache } from 'react-query';
import { FormDialog } from '@/components/FormDialog';
import { SearchBar } from '@/components/SearchBar';
import { Photo } from '@/types';
import { Button, Box, Typography } from '@material-ui/core';
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
  hoverParent: {
    position: 'relative',
  },
  hoverMask: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(0,0,0,0.5)',
    opacity: 0,
    color: '#fff',
    borderRadius: 16,
    '&:hover': {
      opacity: 1,
      transition: 'all 0.6s ease',
    },
  },
  img: {
    borderRadius: 16,
    display: 'block',
  },
  deleteBtn: {
    borderRadius: 32,
  },
});

const deletePhoto = async ({ id }: { id: string }): Promise<Photo> => {
  const response = await fetch('/api/photos', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });
  const data = await response.json();
  const { photo } = data;
  return photo;
};

export default function Home() {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>('');
  const { status, data: photos, error } = useQuery(
    ['photos', keyword],
    fetchPhotos
  );
  const [mutate] = useMutation(deletePhoto, {
    onMutate: ({ id }) => {
      queryCache.cancelQueries('all');

      const prevPhotos: Photo[] | undefined = queryCache.getQueryData([
        'photos',
        keyword,
      ]);

      if (prevPhotos) {
        queryCache.setQueryData<Photo[]>(
          ['photos', keyword],
          prevPhotos.filter(photo => photo.id !== id)
        );
      }

      return () => queryCache.setQueryData('photos', prevPhotos);
    },
    onError: (_error, _photoData, rollback: () => void) => rollback(),
    onSuccess: () => {
      queryCache.invalidateQueries('photos');
    },
  });

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'error') {
    if (isError(error)) {
      console.log(error.message);
    }
  }

  const handleClick = () => {
    setOpen(true);
    setKeyword('');
  };

  const handleDelete: (id: string) => void = async id => {
    try {
      await mutate({ id });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <SearchBar setKeyword={setKeyword} />
      <Button onClick={handleClick} variant="contained" color="primary">
        Add a Photo
      </Button>
      <FormDialog open={open} setOpen={setOpen} />
      {photos && (
        <Masonry>
          {photos.map(photo => (
            <Box key={photo.id} className="item" m={2}>
              <Box className={classes.hoverParent}>
                <img src={photo.url} width="400px" className={classes.img} />
                <Box className={classes.hoverMask}>
                  <Box
                    height="100%"
                    p={2}
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                  >
                    <Box display="flex" justifyContent="flex-end">
                      <Button
                        variant="outlined"
                        color="secondary"
                        className={classes.deleteBtn}
                        onClick={() => handleDelete(photo.id)}
                      >
                        Delete
                      </Button>
                    </Box>
                    <Typography>{photo.label}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Masonry>
      )}
    </>
  );
}
