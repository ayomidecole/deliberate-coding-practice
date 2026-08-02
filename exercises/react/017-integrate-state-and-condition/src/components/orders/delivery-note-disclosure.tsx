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
            <p>{isRevealed ? 'Signature required at delivery.' : null}</p>
        </div>
    );
}
