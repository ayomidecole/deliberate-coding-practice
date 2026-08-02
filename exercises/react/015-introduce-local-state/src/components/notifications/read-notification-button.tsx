import { useState } from 'react';

export function ReadNotificationButton() {
    const [isRead, setIsRead] = useState(false);

    function clickHandler() {
        setIsRead(true);
    }

    return (
        <div>
            <button type="button" onClick={clickHandler}>
                {isRead ? 'Notification read' : 'Mark notification as read'}
            </button>
        </div>
    );
}
