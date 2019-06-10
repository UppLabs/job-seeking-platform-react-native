export const addOrRemove = (array, value) => {
  let results = [...array];
  let index = results.indexOf(value);

  if (index === -1) {
    results.push(value);
  } else {
    results.splice(index, 1);
  }

  return results;
};
