import { useMutation, queryCache } from 'react-query';
import { Photo } from '@/types';
import { PhotoDto } from '@/dto';

const createPhoto = async ({ label, url }: PhotoDto): Promise<Photo> => {
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
};

export const useAddPhoto = () => {
  return useMutation(createPhoto, {
    onMutate: photoData => {
      queryCache.cancelQueries('photos');

      const prevPhotos: Photo[] | undefined = queryCache.getQueryData([
        'photos',
        '',
      ]);

      if (prevPhotos) {
        queryCache.setQueryData<Photo[]>(
          ['photos', ''],
          [
            {
              id: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              ...photoData,
            },
            ...prevPhotos,
          ]
        );
      }

      return () => queryCache.setQueryData(['photos', []], prevPhotos);
    },
    onError: (_error, _photoData, rollback: () => void) => rollback(),
    onSettled: () => {
      queryCache.invalidateQueries('photos');
    },
  });
};
