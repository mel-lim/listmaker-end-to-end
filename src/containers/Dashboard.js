import React, { useState, useContext } from "react";
import { UserContext } from "../UserContext";
import { GreetNewUser } from "../components/DashboardStart/GreetNewUser";
import { Questions } from "../components/DashboardStart/Questions";
import { Lists } from "../components/Lists";
import { Footer } from "../components/Footer";

export const Dashboard = () => {
    const { user, setUser } = useContext(UserContext);
    const [newTrip, setNewTrip] = useState(false);
    const [selected, setSelected] = useState('');
    const [loadLists, setLoadLists] = useState(false);
    const [tripName, setTripName] = useState('');

    return (
        <div>
            <main>
                <div className="dashboard-start-container">
                    <GreetNewUser />
                    {
                        !newTrip ?
                            <input type="button" value='Create new trip' onClick={() => setNewTrip(true)} /> :
                            <Questions selected={selected} setSelected={setSelected} setNewTrip={setNewTrip} setLoadLists={setLoadLists} tripName={tripName} setTripName={setTripName} />
                    }
                </div>

                {loadLists && <Lists selected={selected} />}

            </main>

            <Footer />
        </div>
    );
}