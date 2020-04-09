import React from 'react';
import { IonLoading } from '@ionic/react';
import { useTranslation } from 'react-i18next';

const LoadingAnimation = ({ loading }) => {
    const { t } = useTranslation();

    return (
        <IonLoading
            isOpen={loading}
            message={t('Loading_message')}
        />
    )
}

export default LoadingAnimation