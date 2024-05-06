import { useState } from 'react';

type DefaultType = {
  [key: string]: any;
};

type ReturnTypes = [
  any,
  (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void,
  (value: any) => void,
];

const useInputs = (initialValue: DefaultType): ReturnTypes => {
  const [values, setValues] = useState(initialValue);
  const onChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const file = (event.target as HTMLInputElement).files;
    setValues({
      ...values,
      [event.target.name]: file ? file[0] : event.target.value,
    });
  };

  return [values, onChange, setValues];
};

export default useInputs;
