// Import libraries
import React, { useState, useEffect, useContext, useRef } from "react";
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

// Import api calls
import { fetchTripsApi, createNewListApi, fetchListsApi, editTripDetailsApi } from "../api";

export const Dashboard = () => {

    const { setUser } = useContext(UserContext);
    const { cookieExpiry, setCookieExpiry } = useContext(CookieExpiryContext);
    const newListRef = useRef(null);

    const [allTrips, setAllTrips] = useState([]);
    const initialActiveTripState = { tripId: '', tripName: '', tripCategory: '', tripDuration: '' };
    const [activeTrip, setActiveTrip] = useState(initialActiveTripState); // If the post request to create a new trip is successful, the activeTrip variable will contain the details of the new trip provided in the response

    const [lists, setLists] = useState([]); // This will sit empty until the data is fetched from the server
    const [allListItems, setAllListItems] = useState([]); // This will sit empty until the data is fetched from the server
    const [allDeletedItems, setAllDeletedItems] = useState([]); // This will sit empty until the user starts deleting items from their lists

    const [newTripClicked, setNewTripClicked] = useState(false); // When user clicks 'new trip', this will be set to 'true' engage the form for the user to input the settings to create a new trip

    const [saveTripDetailsMessage, setSaveTripDetailsMessage] = useState('');

    const [saveListsMessage, setSaveListsMessage] = useState('');
    const [nextListIdNum, setNextListIdNum] = useState(0);

    const [isFetchProcessing, setIsFetchProcessing] = useState(false);

    const [openConfirmCredentialsModal, setOpenConfirmCredentialsModal] = useState(false); // This is to open and close the ConfirmCredentialsModal
    const [redirectOnLogout, setRedirectOnLogout] = useState(false);

    // Fetch trips from server on first render
    useEffect(() => {
        fetchTrips();
    }, []);

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
        console.log("cookie expiry useEffect called");
        if (!cookieExpiry) {
            return;
        }
        else {
            localStorage.setItem("cookieExpiry", JSON.stringify(cookieExpiry)); // Save the cookie expiry into localStorage

            const now = dayjs();
            const timeUntilExpiry = dayjs(cookieExpiry).diff(now);

            // Set a timer to prompt the user to confirm their credentials and refresh their token before it expires
            const confirmCredentialsTime = timeUntilExpiry - parseInt(configData.CONFIRM_CREDENTIAL_INTERVAL); // 5 minutes before the JWT expires

            const confirmCredentialsTimer = setTimeout(() => {
                console.log("confirmCredentialsTimer is working");
                setOpenConfirmCredentialsModal(true); // This will open the ConfirmCredentialsModal
            }, confirmCredentialsTime);

            // Set a timer to auto-logout upon the expiry of the token
            const autoLogoutTime = timeUntilExpiry - parseInt(configData.AUTOLOGOUT_BUFFER_INTERVAL);
            const autoLogoutTimer = setTimeout(() => {
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

    // PERSIST STATE OF ACTIVETRIP PAST REFRESH USING LOCAL STORAGE
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

    // PERSIST STATE OF LISTS PAST REFRESH
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

    // PERSIST STATE OF NEXTLISTIDNUM PAST REFRESH
    useEffect(() => {
        const storedNextListIdNum = localStorage.getItem("nextListIdNum");
        if (storedNextListIdNum) {
            setNextListIdNum(JSON.parse(storedNextListIdNum));
        }
    }, []);

    // Once the nextListIdNum variable is updated, we store in localstorage for safekeeping
    useEffect(() => {
        localStorage.setItem("nextListIdNum", JSON.stringify(nextListIdNum));
    }, [nextListIdNum]);

    // PERSIST STATE OF ALLLISTITEMS PAST REFRESH
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

    // PERSIST STATE OF ALLDELETEDITEMS PAST REFRESH
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

    /*     // AUTOSAVE HOOK
        useEffect(() => {
            console.log("autosave hook triggered");
            const timer = setTimeout(() => {
                saveTripDetails();
                saveListChanges();
                console.log("autosave function run");
            }, parseInt(configData.AUTOSAVE_INTERVAL)); // 10 minutes
            return () => clearTimeout(timer);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [listItemsHaveChangedSinceLastSave, tripDetailsHaveChangedSinceLastSave]); */

    // Function to reset the activeTrip and lists etc. states to their values on initial render
    const resetTripAndListStates = () => {
        setActiveTrip({ ...initialActiveTripState });
        setLists([]);
        setAllListItems([]);
        setAllDeletedItems([]);
    }

    // FETCH ALL TRIPS FOR THIS USER
    const fetchTrips = async () => {
        const { response, responseBodyText } = await fetchTripsApi();

        if (response.status === 200 || response.status === 304) {
            console.log("all trips fetched: ", responseBodyText.trips);
            setAllTrips(responseBodyText.trips);
        } else {
            console.log(responseBodyText.message);
        }
    }

    // EDIT TRIP DETAILS (FOR NOW, ONLY THE TRIP NAME CAN BE EDITED)
    const editTripDetails = async editedTripName => {

        // If the trip name is blank / empty, replace it with "Untitled"
        if (!editedTripName) {
            editedTripName = "Untitled";
        }

        const tripId = activeTrip.tripId;
        const requestBodyContent = { editedTripName };

        const { response, responseBodyText } = await editTripDetailsApi(tripId, requestBodyContent);
        setSaveTripDetailsMessage(responseBodyText.message);

        if (response.status === 200 || 304) {
            console.log("edited trip name saved: ", editedTripName);
            setActiveTrip({ ...activeTrip, tripName: editedTripName });
            // CHANGE THIS SO THAT WE JUST CALL FETCH TRIPS DIRECTLY INSTEAD OF THIS CIRCUITOUS HOOK METHOD
            fetchTrips();
        }
    }

    // Function to set the lists and allListItems state for the current/active trip, and initialise the allDeletedItems state
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

    // FETCH LISTS AND LIST ITEMS FOR TRIP
    const fetchLists = async tripId => {

        setIsFetchProcessing(true); // This will ensure that the render function doesn't race past the completion of the fetch request. 
        // While this is true, the renderer will render "Loading...". We will set it back to false at the end of the request to re-render the updated lists as fetched from the db.

        const { response, responseBodyText } = await fetchListsApi(tripId);

        if (response.status === 200 || response.status === 304) {
            // Configure the list and allListItems states
            configureLists(responseBodyText.lists, responseBodyText.allListItems);
            // Note the setIsFetchProcessing(false) is located within the configureLists function
            console.log("lists and list items fetched");

        } else if (response.status === 401) {
            setOpenConfirmCredentialsModal(true);
            console.log(responseBodyText.message);

        } else {
            console.log(responseBodyText.message);
        }
    }

    // Might be able to get rid of this now - think on it
    const generateTempListId = () => {
        const tempListId = `tempList-${nextListIdNum}`; 
        // Increment the next list id number for the temp list id
        setNextListIdNum(prev => prev + 1);
        return tempListId;
    }

    // ADD NEW LIST
    const addNewList = async () => {

        // Make post api call to save new list to db
        const { response, responseBodyText } = await createNewListApi(activeTrip.tripId);

        if (response.status === 201) {
            // Add new list to the lists state
            setLists(prev => [...prev, responseBodyText]);

            // Add an empty array to the allListItems array, to hold the new list items
            setAllListItems(prev => [...prev, []]);

            // Scroll down to the new list
            newListRef.current.scrollIntoView();

            console.log("New untitled list created");
        }

        else {
            console.log(responseBodyText.message);
        }
    }

    return (
        redirectOnLogout ?
            <Redirect to="/login" /> :
            <div>
                <main>
                    <div className="dashboard-console">
                        <GreetUser />
                        <AllTripsDropdown
                            allTrips={allTrips}
                            activeTrip={activeTrip}
                            setActiveTrip={setActiveTrip}
                            fetchLists={fetchLists}
                            resetTripAndListStates={resetTripAndListStates}
                        />
                        <NewTripForm
                            newTripClicked={newTripClicked}
                            setNewTripClicked={setNewTripClicked}
                            setIsFetchProcessing={setIsFetchProcessing}
                            setActiveTrip={setActiveTrip}
                            fetchTrips={fetchTrips}
                            configureLists={configureLists}
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
                                    editTripDetails={editTripDetails}
                                    saveTripDetailsMessage={saveTripDetailsMessage}
                                    saveListsMessage={saveListsMessage}
                                    fetchTrips={fetchTrips}
                                    resetTripAndListStates={resetTripAndListStates}
                                    addNewList={addNewList}
                                />
                                : null
                        }
                    </div>

                    <ConfirmCredentialsModal openConfirmCredentialsModal={openConfirmCredentialsModal} setOpenConfirmCredentialsModal={setOpenConfirmCredentialsModal} />

                    {
                        lists.length && allListItems.length && !isFetchProcessing ?
                            <Lists
                                tripId={activeTrip.tripId}
                                lists={lists}
                                setLists={setLists}
                                allListItems={allListItems}
                                setAllListItems={setAllListItems}
                                allDeletedItems={allDeletedItems}
                                setAllDeletedItems={setAllDeletedItems} />
                            : null
                    }

                </main>

                <span ref={newListRef}></span>

                <Footer />
            </div>
    );
}