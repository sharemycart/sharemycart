export default (array, key = 'uid') => {
  const initialValue = new Map();
  return array.reduce((obj, item) => obj.set(item[key], item), initialValue);
};
