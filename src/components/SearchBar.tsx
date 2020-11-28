import React from 'react';
import { TextField } from '@material-ui/core';

interface Props {
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
}

export const SearchBar: React.FC<Props> = ({ setKeyword }) => {
  const [tmpKeyword, setTemKeyword] = React.useState<string>('');
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTemKeyword(e.currentTarget.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setKeyword(tmpKeyword);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField onChange={handleInput} />
    </form>
  );
};
