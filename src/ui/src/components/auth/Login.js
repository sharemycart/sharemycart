import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import BasicPage from '../basicpage/BasicPage';
import './Login.scss';

import {
	IonContent,
	IonButton,
	IonCol,
	IonRow,
	IonInput,
	IonText,
	IonToast,
	IonImg,
	IonGrid,
	IonLabel,
	IonIcon
} from '@ionic/react';
import { NavLink } from 'react-router-dom';
import { logoFacebook, logoGoogle } from 'ionicons/icons';

import { inject, observer } from 'mobx-react';

const INITIAL_STATE = {
	email: '',
	password: '',
	error: null,
	showForgotPasswordAlert: false,
	showErrorToast: false,
	errMsg: true
};

class Login extends Component {
	constructor (props) {
		super(props);
		this.state = { ...INITIAL_STATE };
	}

	componentDidMount () {}

	_doLogin = async history => {
		try {
			let response = await this.props.store.doLogin(
				this.state.email,
				this.state.password
			);

			if (response.code) {
				throw response;
			}
		} catch (e) {
			this.setState(() => ({ showErrorToast: true, errMsg: e.message }));
		}
	};

	_doFacebookLogin = async () => {
		try {
			let response = await this.props.store.doFacebookLogin();

			if (response.code) {
				throw response;
			}
		} catch (e) {
			this.setState(() => ({ showErrorToast: true, errMsg: e.message }));
		}
	};

	_doGoogleLogin = async () => {
		try {
			let response = await this.props.store.doGoogleLogin();

			if (response.code) {
				throw response;
			}
		} catch (e) {
			this.setState(() => ({ showErrorToast: true, errMsg: e.message }));
		}
	};

	onChange = (event) => {
		console.log({ [event.target.name]: event.target.value });
		this.setState({ [event.target.name]: event.target.value });
	};

	toggleForgorPasswordModal = () => {
		const { showForgotPasswordAlert } = this.state;
		this.setState({
			showForgotPasswordAlert: !showForgotPasswordAlert
		});
	};
	forgotPassword = (event) => {

	};

	render () {
		let { initializationError, activeUser } = this.props.store;

		if (activeUser) {
			return <Redirect to="/home"/>;
		} else {
			return (
				<>
					<IonText color="danger" padding style={{ fontWeight: '500' }}>
						{initializationError && initializationError.message}
					</IonText>
					<BasicPage
						title=''
						className="login-page"
						hasMenu
						store={this.props.store}
						renderContent={history => {
							const { email, password, error } = this.state;
							return (
								<IonContent>
									<IonImg className="image-login" src="../../assets/images/login-center.png"/>
									<IonGrid>
										<IonRow className="logo-text">
											<IonCol size="100px">
												<IonImg src="../../assets/images/logo.png"/>
											</IonCol>
											<IonCol className="ion-align-self-center">
												<IonLabel style={{ color: '#707070' }}>Share</IonLabel>
												<IonLabel style={{ color: '#FA3D04' }}>MyCart</IonLabel>
											</IonCol>
										</IonRow>
									</IonGrid>
									<br/>
									<IonGrid class="padding" style={{ maxWidth: 500 }}>
										<IonRow>
											<IonCol>
												<IonInput
													name="email"
													value={email}
													onIonChange={this.onChange}
													clearInput
													type="email"
													placeholder="Email"
													class="input"
													padding-horizontal
													clear-input="true"></IonInput>
											</IonCol>
										</IonRow>
										<IonRow>
											<IonCol>
												<IonInput
													clearInput
													name="password"
													value={password}
													onIonChange={this.onChange}
													type="password"
													placeholder="Password"
													class="input"
													padding-horizontal></IonInput>
											</IonCol>
										</IonRow>
										<IonRow>
											<IonCol>
												<IonButton
													onClick={e => {
														if (!e.currentTarget) {
															return;
														}
														e.preventDefault();
														this._doLogin(history);
													}}
													type="submit"
													expand="block"
												>
													<strong className="white">Sign
														In</strong>
												</IonButton>
											</IonCol>
										</IonRow>
										<NavLink to="forgot-password">
											<IonRow>
												<IonCol onClick={this.toggleForgorPasswordModal}>
													<IonText><h6 no-margin='true' text-end='true' className="small black">Forgot Password?</h6>
													</IonText>
												</IonCol>
											</IonRow>
										</NavLink>
										<IonRow>
											<IonCol>
												<IonButton onClick={e => {
													e.preventDefault();
													history.push('/register');
												}} type="submit" expand="block" color="warning"><span
													className="social-button-text">New? Create an account</span></IonButton>
											</IonCol>
										</IonRow>

										{error && <p>{error.message}</p>}

										<IonRow>
											<IonCol>
												<IonButton onClick={this._doFacebookLogin} type="submit" expand="block"><IonIcon
													icon={logoFacebook}/><span
													className="social-button-text">Sign In with Facebook</span></IonButton>
											</IonCol>
										</IonRow>
										<IonRow>
											<IonCol>
												<IonButton onClick={this._doGoogleLogin} type="submit" expand="block" color="light"><IonIcon
													icon={logoGoogle}/><span className="social-button-text">Sign In with Google</span></IonButton>
											</IonCol>
										</IonRow>
									</IonGrid>
								</IonContent>
							);
						}}
					/>
					<IonToast
						color="danger"
						isOpen={this.state.showErrorToast}
						onDidDismiss={() =>
							this.setState(() => ({ showErrorToast: false }))
						}
						message={this.state.errMsg}
						duration={2000}
					/>
				</>
			)
				;
		}
	}
}

export default inject('store')(observer(Login));
