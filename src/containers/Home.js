import React, { useState } from "react";
import { Tagline } from "../components/Tagline";
import { Questions } from "../components/Questions";
import { Lists } from "../components/Lists";
import { Footer } from "../components/Footer";

export const Home = () => {
    const [selected, setSelected] = useState('');

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