import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { OutlinedInput } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  textField: {
    height: '40px',
  },
});

interface Props {
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
}

const validationSchema = Yup.object({
  keyword: Yup.string(),
});

export const SearchBar: React.FC<Props> = ({ setKeyword }) => {
  const classes = useStyles();
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
      <div>
        <OutlinedInput
          name="keyword"
          onChange={formik.handleChange}
          value={formik.values.keyword}
          className={classes.textField}
        />
      </div>
    </form>
  );
};
