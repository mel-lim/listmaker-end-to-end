import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../UserContext";
import { GreetNewUser } from "../components/DashboardStart/GreetNewUser";
import { DashboardHeader } from "../components/DashboardStart/DashboardHeader";
import { Lists } from "../components/Lists";
import { Footer } from "../components/Footer";

export const Dashboard = () => {

    const [newTripClicked, setNewTripClicked] = useState(false); // When user clicks 'new trip', this will be set to 'true' engage the 'dashboard header'
    const [activeTrip, setActiveTrip] = useState({ tripId: '', tripName: '', tripCategory: '', tripDuration: ''}); // If the post request is successful, the active trip will be set to the values received in the response body

    const [lists, setLists] = useState([]);
    const [allListItems, setAllListItems] = useState([]);

    useEffect(() => {
        const storedActiveTrip = localStorage.getItem("activeTrip");
        console.log(storedActiveTrip);
        if (storedActiveTrip) {
            setActiveTrip(JSON.parse(storedActiveTrip));
        }
    }, []);

    useEffect(() => {
        const storedNewTripClicked = localStorage.getItem("newTripClicked");
        if (storedNewTripClicked) {
            setNewTripClicked(JSON.parse(storedNewTripClicked));
        }
    }, []);
    
    useEffect(() => {
        localStorage.setItem("activeTrip", JSON.stringify(activeTrip));
    }, [activeTrip]);

    useEffect(() => {
        localStorage.setItem("newTripClicked", JSON.stringify(newTripClicked));
    }, [newTripClicked]);
    

    const generateLists = async () => {

        const response = await fetch(`/trips/generatenewlists/${activeTrip.tripId}?requestTemplate=true`, {
            method: 'GET',
            mode: 'cors',
            cache: 'default',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer'
        });

        const responseBodyText = await response.json();
        console.log(response.status);

        if (response.status === 200 || response.status === 304) {
            console.log("we have 200");
            setLists(responseBodyText.lists);
            setAllListItems(responseBodyText.allListItems);
            console.log(responseBodyText.lists);
            console.log(responseBodyText.allListItems);
        } else {
            console.log(responseBodyText.message);
        }
    }

    return (
        <div>
            <main>
                <div className="dashboard-start-container">
                    <GreetNewUser />
                    {
                        (!newTripClicked && !activeTrip.tripId) ?
                            
                            <input type="button" value='Create new trip' onClick={() => setNewTripClicked(true)} /> :
                            
                            <DashboardHeader setNewTripClicked={setNewTripClicked} activeTrip={activeTrip} setActiveTrip={setActiveTrip} setLists={setLists} generateLists={generateLists} />
                    }
                </div>

                {lists.length && allListItems.length && <Lists lists={lists} allListItems={allListItems} />}

            </main>

            <Footer />
        </div>
    );
}