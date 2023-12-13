import { FormikErrors } from 'formik';

export interface FormikDefaultProps<T> {
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined,
  ) => Promise<void> | Promise<FormikErrors<T>>;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
  handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined;
}

export interface ShowModalProps {
  showModal: boolean;
  handleChangeModal: () => void;
}
