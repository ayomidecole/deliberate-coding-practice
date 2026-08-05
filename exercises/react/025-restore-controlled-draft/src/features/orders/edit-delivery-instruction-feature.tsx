import { type ChangeEvent, useState } from 'react';

import { DeliveryInstructionField } from '../../components/orders/delivery-instruction-field';
import { RestoreInstructionButton } from '../../components/orders/restore-instruction-button';

export const ORIGINAL_DELIVERY_INSTRUCTION = 'Leave at loading dock.';

export function EditDeliveryInstructionFeature() {
    const [instruction, setInstruction] = useState(
        ORIGINAL_DELIVERY_INSTRUCTION,
    );

    const handleInstructions = (event: ChangeEvent<HTMLInputElement>) => {
        setInstruction(event.currentTarget.value);
    };

    const clearInstructions = () => {
        setInstruction(ORIGINAL_DELIVERY_INSTRUCTION);
    };

    return (
        <section aria-labelledby="instructions-header">
            <h2 id="instructions-header">Edit delivery instruction</h2>
            <DeliveryInstructionField
                instruction={instruction}
                onChange={handleInstructions}
            />
            <RestoreInstructionButton
                disabled={instruction === ORIGINAL_DELIVERY_INSTRUCTION}
                onRestore={clearInstructions}
            />
            {instruction === ORIGINAL_DELIVERY_INSTRUCTION ? (
                <p>Original delivery instruction.</p>
            ) : (
                <p>Unsaved instruction: {instruction}</p>
            )}
        </section>
    );
}
