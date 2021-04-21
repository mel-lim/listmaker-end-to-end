// Import libraries
import React, { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";
import dayjs from "dayjs";
import Cookies from "js-cookie";

// Import contexts
import { UserContext, CookieExpiryContext } from "../UserContext";

// Import config data
import configData from "../config.json";

// Import components
import { GreetUser } from "../components/Dashboard/GreetUser";
import { AllTripsDropdown } from "../components/Dashboard/AllTripsDropdown";
import { NewTripForm } from "../components/Dashboard/NewTripForm";
import { ActiveTripConsole } from "../components/Dashboard/ActiveTripConsole";
import { Lists } from "../components/Lists/Lists";
import { Footer } from "../components/Footer";
import { ConfirmCredentialsModal } from "../components/Dashboard/ConfirmCredentialsModal";

export const Dashboard = () => {

    const { setUser } = useContext(UserContext);
    const { cookieExpiry, setCookieExpiry } = useContext(CookieExpiryContext);

    const initialActiveTripState = { tripId: '', tripName: '', tripCategory: '', tripDuration: '' };
    const [activeTrip, setActiveTrip] = useState(initialActiveTripState); // If the post request to create a new trip is successful, the activeTrip variable will contain the details of the new trip provided in the response

    const [lists, setLists] = useState([]); // This will sit empty until the data is fetched from the server
    const [allListItems, setAllListItems] = useState([]); // This will sit empty until the data is fetched from the server
    const [allDeletedItems, setAllDeletedItems] = useState([]); // This will sit empty until the user starts deleting items from their lists

    const [newTripClicked, setNewTripClicked] = useState(false); // When user clicks 'new trip', this will be set to 'true' engage the form for the user to input the settings to create a new trip

    const [toggleRefreshAllTripsDropdown, setToggleRefreshAllTripsDropdown] = useState(false); // When a trip is created or deleted, or the trip name is updated and saved, this will get toggled and activate the hook to re-fetch all trips and show the updated list of all trips in the dropdown.

    const [newTripNeedsSaving, setNewTripNeedsSaving] = useState(false); // When a new trip is created and this will get set to true, and activate a hook to call saveListChanges to save the new lists, once the new lists and allListItems states have resolved
    const [tripDetailsHaveChangedSinceLastSave, setTripDetailsHaveChangedSinceLastSave] = useState(false); // This will be set to true if the user edits the trip name
    const [saveTripDetailsMessage, setSaveTripDetailsMessage] = useState('');

    const [listItemsHaveChangedSinceLastSave, setListItemsHaveChangedSinceLastSave] = useState(false); // This is set to true when the user adds, edits or deletes a list item and reset to false upon a successful save
    const [saveListsMessage, setSaveListsMessage] = useState('');
    
    const [isFetchProcessing, setIsFetchProcessing] = useState(false);

    const [openModal, setOpenModal] = useState(false); // This is to open and close the ConfirmCredentialsModal
    const [redirectOnLogout, setRedirectOnLogout] = useState(false); 

    // PERSIST STATE OF COOKIE EXPIRY PAST REFRESH
    useEffect(() => {
        const storedCookieExpiry = localStorage.getItem("cookieExpiry");
        if (storedCookieExpiry) {
            setCookieExpiry(JSON.parse(storedCookieExpiry));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // When the user successfully logs in, cookieExpiry state will be set / changed, and this will be called 
    useEffect(() => {
        console.log("useEffect called");
        console.log(cookieExpiry);
        if (!cookieExpiry) {
            return;
        }
        else {
            localStorage.setItem("cookieExpiry", JSON.stringify(cookieExpiry)); // Save the cookie expiry into localStorage

            const now = dayjs();
            const timeUntilExpiry = dayjs(cookieExpiry).diff(now);
            console.log(timeUntilExpiry);

            // Set a timer to prompt the user to confirm their credentials and refresh their token before it expires
            const confirmCredentialsTime = timeUntilExpiry - parseInt(configData.CONFIRM_CREDENTIAL_INTERVAL); // 5 minutes before the JWT expires
            console.log(confirmCredentialsTime);

            const confirmCredentialsTimer = setTimeout(() => {

                console.log("confirmCredentialsTimer is working");

                setOpenModal(true); // This will open the ConfirmCredentialsModal
            }, confirmCredentialsTime);

            // Set a timer to auto-logout upon the expiry of the token
            const autoLogoutTime = timeUntilExpiry - parseInt(configData.AUTOLOGOUT_BUFFER_INTERVAL);
            console.log(autoLogoutTime);
            const autoLogoutTimer = setTimeout(() => {

                console.log("autoLogoutTimer is working");

                Cookies.remove('username'); // Delete the username cookie
                localStorage.clear(); // Delete localStorage data
                setUser(null); // Clear user context
                setRedirectOnLogout(true); // Redirect to the login page

                // We won't be able to delete the JWT cookie without making an API call because it is HTTP only, but it will delete by itself, when it expires in one minute

            }, autoLogoutTime);

            return (() => { // Clear timer on unmount (dismount?)
                clearTimeout(confirmCredentialsTimer);
                clearTimeout(autoLogoutTimer);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cookieExpiry]);

    // PERSIST STATE OF newTripClicked PAST REFRESH
    useEffect(() => {
        const storedNewTripClicked = localStorage.getItem("newTripClicked");
        if (storedNewTripClicked) {
            setNewTripClicked(JSON.parse(storedNewTripClicked));
        }
    }, []);

    // Once the user clicks the 'new trip' button and changes the state of the newTripClicked variable, the result is stored in localStorage
    useEffect(() => {
        localStorage.setItem("newTripClicked", JSON.stringify(newTripClicked));
    }, [newTripClicked]);

    // Upon browser refresh, this will get the activeTrip data that we stored in localstorage, so we can persist the activeTrip state
    useEffect(() => {
        const storedActiveTrip = localStorage.getItem("activeTrip");
        if (storedActiveTrip) {
            setActiveTrip(JSON.parse(storedActiveTrip));
        }
    }, []);

    // Once the activeTrip variable is loaded with the details of the trip that has been created, we store in localstorage for safekeeping
    useEffect(() => {
        localStorage.setItem("activeTrip", JSON.stringify(activeTrip));
    }, [activeTrip]);

    // Upon browser refresh, this will get the lists data that we stored in localstorage, so we can persist it
    useEffect(() => {
        const storedLists = localStorage.getItem("lists");
        if (storedLists) {
            setLists(JSON.parse(storedLists));
        }
    }, []);

    // Once the lists variable are loaded with the data fetched from our db, we store in localstorage for safekeeping
    useEffect(() => {
        localStorage.setItem("lists", JSON.stringify(lists));
    }, [lists]);

    // Upon browser refresh, this will get the allListItems data that we stored in localstorage, so we can persist it
    useEffect(() => {
        const storedAllListItems = localStorage.getItem("allListItems");
        if (storedAllListItems) {
            setAllListItems(JSON.parse(storedAllListItems));
        }
    }, []);

    // Once the allListItems variable are loaded with the data fetched from our db, we store in localstorage for safekeeping
    useEffect(() => {
        localStorage.setItem("allListItems", JSON.stringify(allListItems));
    }, [allListItems]);

    // Upon browser refresh, this will get the allDeletedItems data that we stored in localstorage, so we can persist it
    useEffect(() => {
        const storedAllDeletedItems = localStorage.getItem("allDeletedItems");
        if (storedAllDeletedItems) {
            setAllDeletedItems(JSON.parse(storedAllDeletedItems));
        }
    }, []);

    // Once the allDeletedItems variable initialised with its array of empty arrays, we store in localstorage for safekeeping
    useEffect(() => {
        localStorage.setItem("allDeletedItems", JSON.stringify(allDeletedItems));
    }, [allDeletedItems]);

    // NEW TRIP SAVE HOOK
    useEffect(() => {
        console.log("new trip save hook triggered");
        if (newTripNeedsSaving && lists.length && allListItems.length) {
            saveListChanges(); // If successful, the saveListChanges block will set the newTripNeedsSaving state to false
            console.log("new trip lists saved");
        }
        return;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newTripNeedsSaving, lists, allListItems]); // This hook will get called everytime the newTripNeedsSaving state is updated (i.e. when a new trip is created) and everytime the lists or list items change (in case this is called before the lists or allListItems are defined, then get subsequently defined)

    // AUTOSAVE HOOK
    useEffect(() => {
        console.log("autosave hook triggered");
        const timer = setTimeout(() => {
            saveTripDetails();
            saveListChanges();
            console.log("autosave function run");
        }, parseInt(configData.AUTOSAVE_INTERVAL)); // 10 minutes
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listItemsHaveChangedSinceLastSave, tripDetailsHaveChangedSinceLastSave]);

    // Reuseable block to set the lists and allListItems state for the current/active trip, and initialise the allDeletedItems state
    const configureLists = (currentLists, currentAllLists) => {
        // Set the lists and allListItems to their initial values provided by our get request
        setLists(currentLists);
        setAllListItems(currentAllLists);

        // Set the initial value of our allDeletedItems variable to be an array of the same length as the number of lists we have. Each element in that array is itself an empty array.
        const numOfLists = currentLists.length;
        let initialAllDeletedItems = [];
        for (let i = 0; i < numOfLists; i++) {
            initialAllDeletedItems.push([]);
        }
        setAllDeletedItems(initialAllDeletedItems);

        // This tells the lists component that it is ready to be re-rendered
        setIsFetchProcessing(false);
    }

    // Function to reset the activeTrip and lists etc. states to their values on initial render
    const resetOnDelete = () => {
        setActiveTrip({...initialActiveTripState});
        setLists([]);
        setAllListItems([]);
        setAllDeletedItems([]);
    }

    const saveTripDetails = async () => {

        // If the trip name has not been changed since the last save, exit
        if (!tripDetailsHaveChangedSinceLastSave) {
            return;
        }

        const tripName = activeTrip.tripName;

        // If the trip name is blank / empty
        if (!tripName || !tripName.length) {
            setSaveTripDetailsMessage("Unable to save edited trip name: trip name can't be blank");
        }

        console.log("save trip request starting");
        const tripId = activeTrip.tripId;
        const requestBodyContent = { tripName };

        const response = await fetch(`/trips/${tripId}/savetripdetails`, {
            method: 'PUT',
            mode: 'cors',
            cache: 'default',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(requestBodyContent)
        });

        const responseBodyText = await response.json();
        setSaveTripDetailsMessage(responseBodyText.message);   
        
        if (response.status === 200 || 304) {
            console.log("response status is 200 or 304");
            setTripDetailsHaveChangedSinceLastSave(false); // Reset to false once saved
            setToggleRefreshAllTripsDropdown(!toggleRefreshAllTripsDropdown); // This will trigger the hook to re-fetch the all trips data and re-populate the drop down list with the updated trip name
        }
    }

    // Post data to db to save the users changes
    const saveListChanges = async () => {
        
        // If the lists have not changed since the last save, exit
        if (!newTripNeedsSaving && !listItemsHaveChangedSinceLastSave) {
            return;
        }

        if (!lists) { // Not quite sure that this would ever happen in the current version of our app, but let's leave this for now.
            return;
        }

        // At the moment, any empty lists causes the server to crash, so for now, we are preventing the saving of any empty lists
        let isEmptyList;
        allListItems.forEach(listItems => {
            if (!listItems.length) {
                isEmptyList = true;
                return;
            }
        });

        if (isEmptyList) {
            setSaveListsMessage('Unable to save: please add at least one item to each list before saving');
            return;
        }

        console.log("save getting called");
        const tripId = activeTrip.tripId;
        const requestBodyContent = { lists, allListItems };

        const response = await fetch(`/trips/${tripId}/lists/savelists`, {
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(requestBodyContent)
        });

        const responseBodyText = await response.json();
        if (response.status === 201) {
            fetchLists(tripId);
            setListItemsHaveChangedSinceLastSave(false);
            if (newTripNeedsSaving) {
                setNewTripNeedsSaving(false); // This will be reset to false once the new lists are successfully saved for the first time
            }
        }

        setSaveListsMessage(responseBodyText.message);
        console.log(responseBodyText.message);
    }

    // Fetch list data from the db and sync to page
    const fetchLists = async (tripId) => {
        console.log("fetch lists called");
        // This will ensure that the render function doesn't race past the completion of the fetch request. 
        // While this is true, the renderer will render "Loading...". We will set it back to false at the end of the request to re-render the updated lists as fetched from the db.
        setIsFetchProcessing(true);

        const response = await fetch(`/trips/${tripId}/lists/fetchlists`, {
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

        if (response.status === 200 || response.status === 304) {

            // Configure the list and allListItems states
            configureLists(responseBodyText.lists, responseBodyText.allListItems);

        } else {
            console.log(responseBodyText.message);
        }
    }

    return (
        redirectOnLogout ? 
        <Redirect to="/login" /> :
        <div>
            <main>
                <div className="dashboard-start-container">
                    <GreetUser />
                    <AllTripsDropdown
                        fetchLists={fetchLists}
                        activeTrip={activeTrip}
                        setActiveTrip={setActiveTrip}
                        toggleRefreshAllTripsDropdown={toggleRefreshAllTripsDropdown}
                    />
                    <NewTripForm
                        newTripClicked={newTripClicked}
                        setNewTripClicked={setNewTripClicked}
                        setIsFetchProcessing={setIsFetchProcessing}
                        setActiveTrip={setActiveTrip}
                        toggleRefreshAllTripsDropdown={toggleRefreshAllTripsDropdown}
                        setToggleRefreshAllTripsDropdown={setToggleRefreshAllTripsDropdown}
                        configureLists={configureLists}
                        setNewTripNeedsSaving={setNewTripNeedsSaving}
                    />
                    {
                        (activeTrip.tripId) ? // I removed the condition && !isFetchProcessing - if it stays in, everytime we save the lists we get this blinky, glitchy effect. I think it's uncessary - the only thing in active trip console that requires on the fetch request is the save attempt message, and it seems to work fine. Keep and eye on this though. There might have been an edge case error that I put the condition in to address originally. 

                            <ActiveTripConsole 
                                setNewTripClicked={setNewTripClicked}
                                activeTrip={activeTrip}
                                setActiveTrip={setActiveTrip}
                                lists={lists}
                                allListItems={allListItems}
                                fetchLists={fetchLists}
                                saveListChanges={saveListChanges}
                                saveTripDetails={saveTripDetails}
                                saveTripDetailsMessage={saveTripDetailsMessage}
                                saveListsMessage={saveListsMessage}
                                setTripDetailsHaveChangedSinceLastSave={setTripDetailsHaveChangedSinceLastSave}
                                toggleRefreshAllTripsDropdown={toggleRefreshAllTripsDropdown}
                                setToggleRefreshAllTripsDropdown={setToggleRefreshAllTripsDropdown}
                                resetOnDelete={resetOnDelete}
                                 />
                            : null
                    }
                </div>

                <ConfirmCredentialsModal openModal={openModal} setOpenModal={setOpenModal} />

                {lists.length && allListItems.length && !isFetchProcessing ?
                    <Lists
                        lists={lists}
                        setLists={setLists}
                        allListItems={allListItems}
                        setAllListItems={setAllListItems}
                        allDeletedItems={allDeletedItems}
                        setAllDeletedItems={setAllDeletedItems}
                        setListItemsHaveChangedSinceLastSave={setListItemsHaveChangedSinceLastSave} /> :
                    null}

            </main>

            <Footer />
        </div>
    );
}