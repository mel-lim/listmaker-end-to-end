import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../UserContext";
import { GreetNewUser } from "../components/DashboardStart/GreetNewUser";
import { NewTripForm } from "../components/DashboardStart/NewTripForm";
import { Lists } from "../components/Lists";
import { Footer } from "../components/Footer";

export const Dashboard = () => {
    const { user, setUser } = useContext(UserContext);

    const [newTrip, setNewTrip] = useState(false);
    const [loadLists, setLoadLists] = useState(false);

    const [tripName, setTripName] = useState('');
    const [tripCategory, setTripCategory] = useState('');
    const [tripDuration, setTripDuration] = useState('');

    const [tripId, setTripId] = useState('');
    const [activeTrip, setActiveTrip] = useState({});

    useEffect(() => {
        const storedActiveTrip = localStorage.getItem("activeTrip") || {};
        setActiveTrip(storedActiveTrip);
    }, []);
    
    useEffect(() => {
        localStorage.setItem("activeTrip", activeTrip)
    }, [activeTrip]);

    return (
        <div>
            <main>
                <div className="dashboard-start-container">
                    <GreetNewUser />
                    {
                        !newTrip ?
                            <input type="button" value='Create new trip' onClick={() => setNewTrip(true)} /> :
                            <NewTripForm setNewTrip={setNewTrip} setLoadLists={setLoadLists} tripName={tripName} setTripName={setTripName} tripCategory={tripCategory} setTripCategory={setTripCategory} tripDuration={tripDuration} setTripDuration={setTripDuration} setTripId={setTripId} setActiveTrip={setActiveTrip} />
                    }
                </div>

                {/* {loadLists && <Lists selected={selected} />} */}

            </main>

            <Footer />
        </div>
    );
}