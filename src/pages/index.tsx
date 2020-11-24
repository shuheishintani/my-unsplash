import { useQuery, useMutation, queryCache } from 'react-query';
import { Photo } from '@/types';

async function fetchPhotos() {
  const response = await fetch('/api/photos');
  const data = await response.json();
  const { photos } = data;
  return photos;
}

type PhotoDto = {
  label: string;
  url: string;
};

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

export default function Home() {
  const { status, data: photos, error } = useQuery('photos', fetchPhotos);
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

  const clickHandler = async () => {
    try {
      await mutate({ label: 'aaaaa', url: 'bbbbb' });
    } catch (e) {
      console.log(e);
    }
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  const isError = (error: unknown): error is Error => {
    return error instanceof Error;
  };

  if (status === 'error') {
    if (isError(error)) {
      console.log(error.message);
    }
  }
  return (
    <>
      {photos &&
        photos.map((photo: Photo) => <p key={photo.id}>{photo.url}</p>)}
      <button onClick={clickHandler}>ボタン</button>
    </>
  );
}
