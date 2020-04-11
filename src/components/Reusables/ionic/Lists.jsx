import React from "react";
import { IonItem, IonLabel, IonIcon, IonList } from "@ionic/react";
import { arrowForwardOutline, trashBinOutline } from 'ionicons/icons';
import { withRouter } from "react-router";

const Lists = (props) => (
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

export default withRouter(Lists)