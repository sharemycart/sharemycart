import React from "react";
import { IonItem, IonLabel, IonIcon, IonList } from "@ionic/react";
import { trashBinOutline, documentTextOutline } from 'ionicons/icons';
import { withRouter } from "react-router";
import ListTitle from "./ListTitle";
import ListLifecycleIcon from "./ListLifecycleIcon";

const Lists = (props) => {
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
                            <ListTitle list={list} />
                    </IonLabel>
                        <ListLifecycleIcon list={list} slot="start" defaultIcon={documentTextOutline}/>
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