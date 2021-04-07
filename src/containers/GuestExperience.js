import React, { useState, useContext } from "react";
import { UserContext } from "../UserContext";
import { Tagline } from "../components/Tagline";
import { Questions } from "../components/Questions";
import { Lists } from "../components/Lists";
import { Footer } from "../components/Footer";

export const GuestExperience = () => {
    const [selected, setSelected] = useState('');
    const {user, setUser} = useContext(UserContext);

    return (
        <div>
            <main>
                <div id="tagline-and-questions-container">
                    <Tagline />
                    <Questions setSelected={setSelected} />
                </div>

                <Lists selected={selected} />

            </main>

            <Footer />
        </div>
    );
}