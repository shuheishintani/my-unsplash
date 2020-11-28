import { useQuery } from 'react-query';
import { Photo } from '@/types';

const fetchPhotos: (key: string, keyword: string) => Promise<Photo[]> = async (
  _key,
  keyword
) => {
  const response = await fetch(`/api/photos?keyword=${keyword}`);
  const data = await response.json();
  const { photos } = data;
  console.log('fetch');
  return photos;
};

export const useFetchPhotos = (keyword: string) => {
  return useQuery(['photos', keyword], fetchPhotos);
};
