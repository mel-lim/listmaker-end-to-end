import React, { useState } from "react";

export const Contact = () => {
    const [submissionStatusMessage, setSubmissionStatusMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSubmissionStatusMessage('Sending...');
        console.log(event.target.elements);
        const { name, email, subject, message } = event.target.elements; // See MDN documentation for HtmlFormElements/elements

        const details = {
            name: name.value,
            email: email.value,
            subject: subject.value,
            message: message.value
        }

        const response = await fetch('/api/contact', {
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(details)
        });

        const result = await response.json();
        setSubmissionStatusMessage(result.message);
    }

    return (
        <div id="form-container">
            <h3>Send us a message</h3>
            <form id="contact-form" onSubmit={handleSubmit}>

                <div className="form-row">
                    <input type="text" id="name" name="name" placeholder="Your name..." required />
                    <input type="email" id="email" name="email" placeholder="Your email address..." required />
                </div>

                <div className="form-row">
                    <input type="text" id="subject" name="subject" placeholder="Subject..." />
                </div>

                <div className="form-row">
                    <textarea id="message" name="message" placeholder="Your message..." required ></textarea>
                </div>

                <div className="form-row" id="submit-row">
                    <input type="submit" className="pillbox-button" value="Send" />
                </div>

            </form>

            <p>{submissionStatusMessage}</p>
        </div>
    );
}

