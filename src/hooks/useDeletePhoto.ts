import { useMutation, queryCache } from 'react-query';
import { Photo } from '@/types';

const deletePhoto: ({ id }: { id: string }) => Promise<Photo> = async ({
  id,
}) => {
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

export const useDeletePhoto = (keyword: string) => {
  return useMutation(deletePhoto, {
    onMutate: ({ id }) => {
      queryCache.cancelQueries('photos');

      const prevPhotos: Photo[] | undefined = queryCache.getQueryData([
        'photos',
        keyword,
      ]);

      if (prevPhotos) {
        queryCache.setQueryData<Photo[]>(
          ['photos', keyword],
          prevPhotos.filter(photo => photo.id !== id)
        );
        console.log('setQuery');
      }

      return () => queryCache.setQueryData(['photos', keyword], prevPhotos);
    },
    onError: (_error, _photoData, rollback: () => void) => rollback(),
    onSettled: () => {
      queryCache.invalidateQueries('photos');
      console.log('invalidateQuery');
    },
  });
};
