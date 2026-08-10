import { useState } from 'react';

export function FirstStepButton() {
    const [number, setNumber] = useState(0);

    function clickHandler() {
        setNumber(1);
    }
    return (
        <button type="button" onClick={clickHandler}>
            {`Completed steps: ${number}`}
        </button>
    );
}
