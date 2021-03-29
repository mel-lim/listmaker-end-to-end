import React, { useState } from "react";

export const Contact = () => {
    return (

        <div id="form-container">
            <h3>Send a note</h3>
            <form method="post" action="https://formspree.io/f/xdoplron" id="contact-form" name="email-form">

                <div className="form-row">
                    <input type="text" id="name" name="name" placeholder="Your name..." />
                    <input type="text" id="email-address" name="email-address" placeholder="Your email address..." />
                </div>

                <div className="form-row">
                    <input type="text" id="subject" name="subject" placeholder="Subject..." />
                </div>

                <div className="form-row">
                    <textarea id="message" name="message" placeholder="Your message..."></textarea>
                </div>

                <div className="form-row" id="submit-row">
                    <input type="submit" value="Send message" />
                </div>

            </form>
        </div>
    );
}

