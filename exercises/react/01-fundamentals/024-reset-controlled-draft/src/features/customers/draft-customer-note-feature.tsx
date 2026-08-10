import { type ChangeEvent, useState } from 'react';

import { ClearDraftButton } from '../../components/customers/clear-draft-button';
import { CustomerNoteField } from '../../components/customers/customer-note-field';

export function DraftCustomerNoteFeature() {
    const [note, setNote] = useState('');

    const handleNote = (event: ChangeEvent<HTMLInputElement>) => {
        setNote(event.currentTarget.value);
    };

    const clearNote = () => {
        setNote('');
    };

    return (
        <section aria-labelledby="find-note-heading">
            <h2 id="find-note-heading">Draft customer note</h2>
            <CustomerNoteField note={note} onChange={handleNote} />
            <ClearDraftButton disabled={note === ''} onClear={clearNote} />
            {note === '' ? <p>No note started.</p> : <p>Draft note: {note}</p>}
        </section>
    );
}
