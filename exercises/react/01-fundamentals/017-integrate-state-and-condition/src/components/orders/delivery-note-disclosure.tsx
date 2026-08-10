import { useState } from 'react';

export function DeliveryNoteDisclosure() {
    const [isRevealed, setIsRevealed] = useState(false);

    function clickHandler() {
        setIsRevealed(true);
    }

    return (
        <div>
            <button type="button" onClick={clickHandler}>
                Reveal delivery note
        </button>
        {isRevealed? <p>Signature required at delivery.</p> : null}
        </div>
    );
}
