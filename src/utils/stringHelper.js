export const hideMax = (text, max) => {
  let result = text;
  if (text.length > max) {
    result = text.substring(0, max) + '...';
  }

  return result;
};

export const whereFormat = location => {
  return `${location.city}, ${location.street} ${location.streetNumber} `;
};
