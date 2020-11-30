import * as Yup from 'yup';

export const addPhotoSchema = Yup.object({
  label: Yup.string().required('Required'),

  url: Yup.string()
    .required('Required')
    .matches(/^(?=https:\/\/)(?=.*.(jpeg|jpg|gif|png))/, {
      message: 'Invalid Url',
    }),
});
