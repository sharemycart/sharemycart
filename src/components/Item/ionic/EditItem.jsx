import React, { Component } from 'react'
import { IonItem, IonButton, IonInput, IonSelect, IonSelectOption, IonLabel, IonIcon, IonToast } from '@ionic/react'
import { ITEM_TYPE_SHOPPING } from '../../../constants/items'

import { withTranslation } from 'react-i18next'
import { checkmarkOutline, closeOutline } from 'ionicons/icons'
import { ENTER } from '../../Reusables/keys'

class EditItem extends Component {
	constructor(props) {
		super(props)

		this.state = {
			...props.item,
			showToast: false,
			message: '',
		}

		this.nameInput = React.createRef()
		this.quantityInput = React.createRef()
	}

	concludeEditing(confirm = true) {
		const { item, t } = this.props
		if (confirm) {
			const { name, quantity, unit = '' } = this.state
			if (name && quantity) {
				this.props.onEditingConcluded(Object.assign(item, {
					name,
					quantity,
					unit,
				}))
			} else {
				this.setState({
					showToast: true,
					message: t('Name_and_quantity_mandatory')
				})
			}
			this.quantityInput.current.setFocus()
		} else {
			// reset it
			this.props.onEditingConcluded(item)
		}
	}

	componentDidMount() {
		setTimeout(() => {
			if (this.quantityInput.current) { this.quantityInput.current.setFocus() }
		}, 500)
	}

	onChange(event) {
		this.setState({ [event.target.name]: event.target.value })
	}

	onKeyPress = (event) => {
		if (event.which === ENTER) this.concludeEditing()
	}

	onBlur(event) {
		if (event.target.parentElement !== event.srcElement.parentElement) {
			this.concludeEditing()
		}
	}

	setUnit(unit) {
		this.setState({ unit })
	}

	render() {
		const { name, quantity, unit } = this.state

		const { t } = this.props

		const unitOfMeasure = this.props.mode === ITEM_TYPE_SHOPPING
			? <IonSelect
				value={unit}
				required="true"
				slot="end"
				onIonChange={e => this.setUnit(e.detail.value)}
			>
				<IonSelectOption>pc</IonSelectOption>
				<IonSelectOption>g</IonSelectOption>
				<IonSelectOption>kg</IonSelectOption>
				<IonSelectOption>l</IonSelectOption>
				<IonSelectOption>ml</IonSelectOption>
			</IonSelect>
			: <IonLabel
				marginLeft="2px"
				slot="end"
			>
				{unit}
			</IonLabel>

		return (
			<>
				<IonItem style={{ width: '100%' }}>
					<IonInput
						placeholder={t('Item name')}
						name="name"
						value={name}
						autocapitalize
						autocorrect="on"
						debounce={100}
						style={{ marginRight: '0px', minWidth: '135px' }}
						size={16}
						slot=""
						onKeyUp={this.onKeyPress}
						onIonInput={event => this.onKeyPress(event)}
						onIonChange={event => this.onChange(event)}
						onIonBlur={event => this.onBlur(event)}
						ref={this.nameInput}
					/>
					<IonInput
						// autofocus={(this.props.mode === ITEM_TYPE_NEED) || (this.props.mode === ITEM_TYPE_SHOPPING && name)}
						placeholder={t('Quantity')}
						name="quantity"
						type="number"
						min="0"
						pattern="\d+,?\d*"
						value={quantity}
						onKeyUp={this.onKeyPress}
						onIonChange={event => this.onChange(event)}
						onIonBlur={event => this.onBlur(event)}
						required="false"
						slot="end"
						style={{ marginRight: '0px', maxWidth: '42px', textAlign: 'right' }}
						ref={this.quantityInput}
					/>
					{unitOfMeasure}
					<IonButton
						color="danger"
						slot="end"
						onClick={() => this.concludeEditing(false)}
					// style={{ 'marginLeft': '10px' }}
					>
						<IonIcon icon={closeOutline} />
					</IonButton>
					<IonButton color="success"
						slot="end"
						onClick={() => this.concludeEditing()}
						style={{ 'marginLeft': '10px' }}>
						<IonIcon icon={checkmarkOutline} />
					</IonButton>
				</IonItem>
				<IonToast
					isOpen={this.state.showToast}
					onDidDismiss={() => this.setState(() => ({ showToast: false }))}
					message={this.state.message}
					duration={3000}
				/>
			</>
		)
	}
}

export default withTranslation()(EditItem)
