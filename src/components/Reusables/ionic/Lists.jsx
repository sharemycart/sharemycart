import React from "react";
import { IonItem, IonLabel, IonIcon, IonList } from "@ionic/react";
import { arrowForwardOutline, trashBinOutline } from 'ionicons/icons';
import { withRouter } from "react-router";
import { SHOPPING } from "../../../constants/routes";

const Lists = (props) => (
    <IonList>
        {
            props.lists && props.lists.length && props.lists.map(list => (
                <IonItem 
                    key={list.uid}
                    onClick={() => {
                    props.model.onSetCurrentShoppingList(list.uid)
                    props.history.push(SHOPPING)
                }}>
                    <IonLabel>
                        {list.name}
                    </IonLabel>
                    <IonIcon icon={arrowForwardOutline} slot="start" />
                    <IonIcon icon={trashBinOutline} slot="end" color="danger" onClick={() => {
                        props.model.onRemoveShoppingList(list.uid)
                    }
                    } />
                </IonItem>
            ))
        }
    </IonList>
)

export default withRouter(Lists)