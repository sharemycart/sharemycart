import { useTranslation } from 'react-i18next'

const ListTitle = ({ list }) => {

	const { t } = useTranslation()
	if (!list) return ''

	return list.name || t('Shopping list')
}

export default ListTitle