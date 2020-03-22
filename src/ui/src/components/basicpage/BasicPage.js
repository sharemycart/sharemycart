import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonButtons,
	IonMenuButton,
	IonButton,
	IonBackButton,
	IonIcon
} from '@ionic/react';
import ProfileButton from '../profile/ProfileButton';
import TabContainer from '../tabs/TabContainer';

/**
 * helper Ionic Page which laysout the framework of the page so
 * we dont need to repeat the boilerplate code. We also include
 * the router by default to help with page navigation
 *
 *
 */
const BasicPage = ({ title, renderContent, history, hasMenu, backAction, className, hideBottomBar }) => {
	let layout = '';

	if (title) {
		layout = <IonHeader>
			<IonToolbar color="primary">
				<IonButtons slot="start">
					{hasMenu ? <IonMenuButton/> : null}
					{backAction ? <IonBackButton defaultHref="/" text="" goBack={() => {}}/> : null}
				</IonButtons>
				<IonButtons slot="end">
					<ProfileButton/>
				</IonButtons>
				<IonTitle>{title}</IonTitle>
			</IonToolbar>
		</IonHeader>;
	}
	let bottomBar = '';
	if (!hideBottomBar) {
		bottomBar = <TabContainer history={history}/>;
	}
	return (
		<>
			{layout}
			<IonContent className={className || ''} padding>{renderContent(history)}</IonContent>
			{bottomBar}
		</>
	);
};

BasicPage.propTypes = {
	title: PropTypes.string.isRequired,
	hasMenu: PropTypes.bool,
	backAction: PropTypes.func,
	renderContent: PropTypes.func.isRequired
};

export default withRouter(BasicPage);