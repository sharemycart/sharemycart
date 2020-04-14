import React from "react";
import { IonItem, IonLabel, IonIcon, IonList } from "@ionic/react";
import { trashBinOutline, documentTextOutline } from 'ionicons/icons';
import { withRouter } from "react-router";
import ListTitle from "./ListTitle";
import ListLifecycleIcon from "./ListLifecycleIcon";
import { LIFECYCLE_STATUS_ARCHIVED } from "../../../constants/lists";

const Lists = (props) => {
    return (
        <IonList>
            {
                props.lists && props.lists
                    .filter(l => props.includeArchived ? true : l.lifecycleStatus !== LIFECYCLE_STATUS_ARCHIVED)
                    .map(list => (
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