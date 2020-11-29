import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField } from '@material-ui/core';

interface Props {
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
}

const validationSchema = Yup.object({
  keyword: Yup.string(),
});

export const SearchBar: React.FC<Props> = ({ setKeyword }) => {
  const formik = useFormik({
    initialValues: {
      keyword: '',
    },
    onSubmit: async values => {
      setKeyword(values.keyword);
    },
    validationSchema,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        name="keyword"
        variant="outlined"
        onChange={formik.handleChange}
        value={formik.values.keyword}
      />
    </form>
  );
};
