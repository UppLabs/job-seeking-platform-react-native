export const notEmpty = value => {
  return (value != null && value !== undefined && typeof value !== 'string' && !isNaN(value)) ||
    (value != null && value !== undefined && value.length > 0)
    ? null
    : 'Required';
};

export const emailValidator = value => {
  const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

  return !reg.test(value) ? 'Email is not valid' : null;
};
