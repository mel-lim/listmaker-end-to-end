import React, { useState, useContext } from "react";
import { UserContext } from "../UserContext";
import { GreetNewUser } from "../components/DashboardStart/GreetNewUser";
import { NewTripQuestions } from "../components/DashboardStart/NewTripQuestions";
import { Lists } from "../components/Lists";
import { Footer } from "../components/Footer";

export const Dashboard = () => {
    const { user, setUser } = useContext(UserContext);

    const [newTrip, setNewTrip] = useState(false);
    const [loadLists, setLoadLists] = useState(false);

    const [tripName, setTripName] = useState('');
    const [tripCategory, setTripCategory] = useState('');
    const [tripDuration, setTripDuration] = useState('');

    return (
        <div>
            <main>
                <div className="dashboard-start-container">
                    <GreetNewUser />
                    {
                        !newTrip ?
                            <input type="button" value='Create new trip' onClick={() => setNewTrip(true)} /> :
                            <NewTripQuestions setNewTrip={setNewTrip} setLoadLists={setLoadLists} tripName={tripName} setTripName={setTripName} tripCategory={tripCategory} setTripCategory={setTripCategory} tripDuration={tripDuration} setTripDuration={setTripDuration} />
                    }
                </div>

                {/* {loadLists && <Lists selected={selected} />} */}

            </main>

            <Footer />
        </div>
    );
}