import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {withTranslation} from 'react-i18next';

import {
    IonFab,
    IonToast,
    IonFabButton,
    IonIcon} from '@ionic/react';
import { share } from 'ionicons/icons';
import { compose } from 'recompose';

class ShareListFab extends Component {
    constructor(props) {
        super(props);
        this._hasUnmounted = false;
        this.state = {
            message: '',
            showToast: false
        };
    }

    generateShareLink = () => {
        let shoppingListId = this.props.shoppingList.uid
        return `${window.location.origin}/share/${shoppingListId}`;
    };

    async componentDidMount() {
        if (this._hasUnmounted) {
            return;
        }
    }

    componentWillUnmount() {
        this._hasUnmounted = true;
    }

    render() {
        const {t} = this.props;
        return (
            <>
                <CopyToClipboard text={this.generateShareLink()}>
                    <IonFab vertical="bottom" horizontal="end" onClick={() => {
                        this.setState({
                            showToast: true,
                            message: t('Sharing_link_copied')
                        })
                    }}>
					<IonFabButton><IonIcon icon={share} /></IonFabButton>
                    </IonFab>
                </CopyToClipboard>
                <IonToast
                    isOpen={this.state.showToast}
                    onDidDismiss={() => this.setState(() => ({ showToast: false }))}
                    message={this.state.message}
                    duration={5000}
                />
            </>
        );
    }
}

export default compose(
    withTranslation(),
    withRouter
)(ShareListFab)