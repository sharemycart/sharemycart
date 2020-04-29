export default (array, key = 'uid') => {
	const initialValue = new Map()
	return array.reduce((obj, item) => {
		return obj.set(item[key], item)
	}, initialValue)
}