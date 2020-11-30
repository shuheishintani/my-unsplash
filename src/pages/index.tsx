import { useState } from 'react';
import { useFetchPhotos } from '@/hooks/useFetchPhotos';
import { useDeletePhoto } from '@/hooks/useDeletePhoto';
import { FormDialog } from '@/components/FormDialog';
import { SearchBar } from '@/components/SearchBar';
import { Button, Box, Typography, Container, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Masonry from 'react-masonry-component';

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
  masonry: {
    margin: '0 auto',
  },
});

const masonryOptions = {
  fitWidth: true,
};

export default function Home() {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>('');
  const { status, data: photos, error } = useFetchPhotos(keyword);
  const [mutate] = useDeletePhoto(keyword);

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
      <Box
        display="flex"
        my={5}
        maxWidth={1700}
        minWidth={550}
        style={{ margin: '30px auto 50px' }}
      >
        <Box display="flex" flexGrow={1}>
          <img src="my_unsplash_logo.svg" alt="" />
          <Box m={2} />
          <SearchBar setKeyword={setKeyword} />
        </Box>
        <Button onClick={handleClick} variant="contained" color="primary">
          Add a Photo
        </Button>
      </Box>

      <FormDialog open={open} setOpen={setOpen} />

      {photos && (
        <Masonry className={classes.masonry} options={masonryOptions}>
          {photos.map(photo => (
            <Box key={photo.id} className="item" m={2}>
              <Box className={classes.hoverParent}>
                <img src={photo.url} className={classes.img} width="400px" />
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
