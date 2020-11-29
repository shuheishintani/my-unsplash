import React from 'react';
import { useAddPhoto } from '@/hooks/useAddPhoto';
import { PhotoDto } from '@/dto';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@material-ui/core';

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const validationSchema = Yup.object({
  label: Yup.string().required('Required'),

  url: Yup.string()
    .required('Required')
    .matches(/^(?=https:\/\/)(?=.*.(jpeg|jpg|gif|png))/, {
      message: 'Invalid Url',
    }),
});

export const FormDialog: React.FC<Props> = ({ open, setOpen }) => {
  const [mutate] = useAddPhoto();
  const formik = useFormik({
    initialValues: {
      label: '',
      url: '',
    },
    onSubmit: async (values: PhotoDto) => {
      try {
        setOpen(false);
        await mutate(values);
      } catch (e) {
        console.log(e);
      }
    },
    validationSchema,
  });

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Add a new photo</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent style={{ width: '400px' }}>
          <TextField
            label="Label"
            name="label"
            variant="outlined"
            margin="dense"
            fullWidth
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.label}
          />
          {formik.touched.label && formik.errors.label && (
            <Typography variant="body2" color="secondary">
              {formik.errors.label}
            </Typography>
          )}
          <TextField
            label="Photo URL"
            name="url"
            variant="outlined"
            margin="dense"
            fullWidth
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.url}
          />
          {formik.touched.url && formik.errors.url && (
            <Typography variant="body2" color="secondary">
              {formik.errors.url}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
