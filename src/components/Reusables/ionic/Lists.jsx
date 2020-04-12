import React from "react";
import { IonItem, IonLabel, IonIcon, IonList } from "@ionic/react";
import { arrowForwardOutline, trashBinOutline } from 'ionicons/icons';
import { withRouter } from "react-router";
import { useTranslation } from "react-i18next";
import { LIFECYCLE_STATUS_OPEN } from "../../../constants/lists";

const Lists = (props) => {
    const { t } = useTranslation()
    return (
        <IonList>
            {
                props.lists && props.lists.map(list => (
                    <IonItem
                        key={list.uid}
                        onClick={() => {
                            props.onSetCurrentList(list.uid)
                            props.history.push(props.hrefOnClick)
                        }}>
                        <IonLabel>
                            {list.name} 
                            {list.lifecycleStatus !== LIFECYCLE_STATUS_OPEN && ' (' + t(list.lifecycleStatus) + ')'}
                    </IonLabel>
                        <IonIcon icon={arrowForwardOutline} slot="start" />
                        <IonIcon icon={trashBinOutline} slot="end" color="danger" onClick={() => {
                            props.onRemoveList(list.uid)
                        }
                        } />
                    </IonItem>
                ))
            }
        </IonList>
    )
}

export default withRouter(Lists)