export default (array, key = 'uid') => {
  const initialValue = {};
  return array.reduce((obj, item) => ({
    ...obj,
    [item[key]]: item,
  }), initialValue);
};
