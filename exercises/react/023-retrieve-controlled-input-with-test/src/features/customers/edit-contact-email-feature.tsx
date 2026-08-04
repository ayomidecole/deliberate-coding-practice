import { type ChangeEvent, useState } from 'react';

import { ContactEmailField } from '../../components/customers/contact-email-field';

export function EditContactEmailFeature() {
    const [email, setEmail] = useState('');

    const handleEmail = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.currentTarget.value);
    };

    return (
        <section aria-labelledby="find-email-heading">
            <h2 id="find-email-heading">Edit contact email</h2>
            <ContactEmailField email={email} onChange={handleEmail} />
            {email === '' ? (
                <p>No contact email entered.</p>
            ) : (
                <p>Draft email: {email}</p>
            )}
        </section>
    );
}
