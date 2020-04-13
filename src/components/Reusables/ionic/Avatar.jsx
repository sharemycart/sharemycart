import React from 'react'
import { IonAvatar } from '@ionic/react'
import md5 from 'md5'
import UserProfileImg from './UserProfileImg';

const Avatar = ({
    user,
    size = 200,
    slot = ''
}) => {
    return (
        <IonAvatar style={{ width: size, height: size }} slot={slot}>
            <UserProfileImg size={size} user={user} />
        </IonAvatar>
    )
}

export default Avatar