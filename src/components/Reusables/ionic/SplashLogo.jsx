import React from 'react'
import { IonImg, IonGrid, IonRow, IonCol, IonLabel } from '@ionic/react'

const SplashLogo = (props) => (
	<>
		<IonImg className="image-login" src="logo-cart_1000.png" style={{ maxWidth: props.maxWidth }} />
		<IonGrid>
			<IonRow className="logo-text">
				<IonCol className="ion-align-self-center">
					<IonLabel style={{ color: '#707070' }}>{props.textStart || 'Share'}</IonLabel>
					<IonLabel style={{ color: '#FA3D04' }}>{props.textEnd || 'MyCart!'}</IonLabel>
				</IonCol>
			</IonRow>
		</IonGrid>
	</>
)

export default SplashLogo