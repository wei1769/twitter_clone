export const handleError = (status: number, message: string) => {
  const error = new Error();
  error.message = message;
  return error;
};
