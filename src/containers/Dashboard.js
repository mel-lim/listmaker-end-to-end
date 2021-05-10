// Import libraries
import React, { useState, useEffect, useContext, useRef } from "react";
import { Redirect } from "react-router-dom";
import dayjs from "dayjs";
import Cookies from "js-cookie";

// Import contexts
import { UserContext, CookieExpiryContext, GuestUserContext } from "../UserContext";

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
import { GuestUserModal } from "../components/Dashboard/GuestUserModal";

// Import api calls
import { delay, fetchTripsApi, createNewListApi, fetchListsApi, editTripDetailsApi } from "../api";

export const Dashboard = () => {

    const { setUser } = useContext(UserContext);
    const { cookieExpiry, setCookieExpiry } = useContext(CookieExpiryContext);
    const { isGuestUser } = useContext(GuestUserContext);
    const newListRef = useRef(null); // This is so that we can scroll down to a new list as soon as we have created it

    const [newTripClicked, setNewTripClicked] = useState(false); // When user clicks 'new trip', this will be set to 'true' engage the form for the user to input the settings to create a new trip
    const [allTrips, setAllTrips] = useState([]); // This holds a list of all the pre-existing trips for this user, and populates the trip dropdown list
    const initialActiveTripState = { tripId: '', tripName: '', tripCategory: '', tripDuration: '' };
    const [activeTrip, setActiveTrip] = useState(initialActiveTripState); //  This populates the ActiveTripConsole holds the detail about the selected trip

    const [lists, setLists] = useState([]); // This will sit empty until the data is fetched from the server
    const [allListItems, setAllListItems] = useState([]); // This will sit empty until the data is fetched from the server
    const [allDeletedItems, setAllDeletedItems] = useState([]); // This will sit empty until the user starts deleting items from their lists
    const [nextListIdNum, setNextListIdNum] = useState(0);

    const [isFetchProcessing, setIsFetchProcessing] = useState(false); // This prevents the component from racing to render before the fetch call is completed and the relevant states are set
    const [connectionErrorMessage, setConnectionErrorMessage] = useState(null);

    const [openConfirmCredentialsModal, setOpenConfirmCredentialsModal] = useState(false); // This is to open and close the ConfirmCredentialsModal
    const [redirectOnLogout, setRedirectOnLogout] = useState(false);
    const [openGuestUserModal, setOpenGuestUserModal] = useState(false);

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
            console.log('we are here at else');
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

    // CHECK IF GUEST USER WHEN FIRST RENDER
    useEffect(() => {
        isGuestUser ? setOpenGuestUserModal(true) : setOpenGuestUserModal(false);
        console.log("isGuestUser", isGuestUser);
        console.log(openGuestUserModal);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // FETCH TRIPS FROM SERVER ON FIRST RENDER
    useEffect(() => {
        fetchTrips();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // PERSIST STATE OF ALLTRIPS PAST REFRESH
    useEffect(() => {
        const storedAllTrips = localStorage.getItem("allTrips");
        if (storedAllTrips) {
            setAllTrips(JSON.parse(storedAllTrips));
        }
    }, []);

    // When the allTrips state is updated, store it in localStorage
    useEffect(() => {
        localStorage.setItem("allTrips", JSON.stringify(allTrips));
    }, [allTrips]);

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

    // Function to reset the activeTrip and lists etc. states to their values on initial render
    const resetTripAndListStates = () => {
        setActiveTrip({ ...initialActiveTripState });
        setLists([]);
        setAllListItems([]);
        setAllDeletedItems([]);
    }

    // FETCH ALL TRIPS FOR THIS USER
    const fetchTrips = async (retryCount = 0) => {
        try {
            const { response, responseBodyText } = await fetchTripsApi();
            setConnectionErrorMessage(null);

            if (response.status === 200 || response.status === 304) {
                console.log("all trips fetched: ", responseBodyText.trips);
                setAllTrips(responseBodyText.trips);
            } else {
                console.log(responseBodyText.message);
            }
        } catch {
            console.error("Error in fetchTrips function. Cannot connect to server");

            if (retryCount < parseInt(configData.MAX_RETRY_COUNT)) {
                setConnectionErrorMessage(`The server not responding. Trying again... ${retryCount}/${parseInt(configData.MAX_RETRY_COUNT) - 1}`);
                await delay(retryCount); // Exponential backoff - see api.js
                return fetchTrips(retryCount + 1); // After the delay, try connecting again
            }
            setConnectionErrorMessage('Sorry, our server is not responding. Please check your internet connection or come back later.');
        }
    }

    // EDIT TRIP DETAILS
    // For now, only the trip name can be edited
    const editTripDetails = async (editedTripName, retryCount = 0) => {

        // If the trip name is blank / empty, replace it with "Untitled"
        if (!editedTripName) {
            editedTripName = "Untitled";
        }

        const tripId = activeTrip.tripId;
        const requestBodyContent = { editedTripName };

        try {
            const { response, responseBodyText } = await editTripDetailsApi(tripId, requestBodyContent);
            setConnectionErrorMessage(null);

            if (response.status === 200 || 304) {
                console.log("edited trip name saved: ", editedTripName);
                setActiveTrip({ ...activeTrip, tripName: editedTripName });
                fetchTrips(); // We want the dropdown list to show the updated trip name
            } else {
                console.log(responseBodyText.message);
            }
        } catch {
            console.error("Error in editTripDetails function. Cannot connect to server");

            if (retryCount < parseInt(configData.MAX_RETRY_COUNT)) {
                setConnectionErrorMessage(`The server not responding. Trying again... ${retryCount}/${parseInt(configData.MAX_RETRY_COUNT) - 1}`);
                await delay(retryCount); // Exponential backoff - see api.js
                return editTripDetails(editedTripName, retryCount + 1); // After the delay, try connecting again
            }

            setConnectionErrorMessage('Sorry, our server is not responding. Please check your internet connection or come back later.');
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
    const fetchLists = async (tripId, retryCount = 0) => {

        setIsFetchProcessing(true); // This will ensure that the render function doesn't race past the completion of the fetch request. 
        // While this is true, the renderer will render "Loading...". We will set it back to false at the end of the request to re-render the updated lists as fetched from the db.

        try {
            const { response, responseBodyText } = await fetchListsApi(tripId);
            setConnectionErrorMessage(null);

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
        } catch {
            console.error("Error in fetchLists function. Cannot connect to server");

            if (retryCount < parseInt(configData.MAX_RETRY_COUNT)) {
                setConnectionErrorMessage(`The server not responding. Trying again... ${retryCount}/${parseInt(configData.MAX_RETRY_COUNT) - 1}`);
                await delay(retryCount); // Exponential backoff - see api.js
                return fetchLists(tripId, retryCount + 1); // After the delay, try connecting again
            }

            setConnectionErrorMessage('Sorry, our server is not responding. Please check your internet connection or come back later.');
        }
    }

    // Keep in case useful for development of offline mode
    /*     const generateTempListId = () => {
            const tempListId = `tempList-${nextListIdNum}`;
            // Increment the next list id number for the temp list id
            setNextListIdNum(prev => prev + 1);
            return tempListId;
        } */

    // CREATE NEW LIST
    const createNewList = async (retryCount = 0) => {
        try {
            // Make post api call to save new list to db
            const { response, responseBodyText } = await createNewListApi(activeTrip.tripId);
            setConnectionErrorMessage(null);

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
        } catch {
            console.error("Error in createNewList function. Cannot connect to server");

            if (retryCount < parseInt(configData.MAX_RETRY_COUNT)) {
                setConnectionErrorMessage(`The server not responding. Trying again... ${retryCount}/${parseInt(configData.MAX_RETRY_COUNT) - 1}`);
                await delay(retryCount); // Exponential backoff - see api.js
                return createNewList(retryCount + 1); // After the delay, try connecting again
            }

            setConnectionErrorMessage('Sorry, our server is not responding. Please check your internet connection or come back later.');
        }
    }

    return (
        redirectOnLogout ?
            <Redirect to="/login" /> :
            <div>
                <main>
                    <div className="dashboard-console">
                        <GreetUser />
                        <NewTripForm
                            newTripClicked={newTripClicked}
                            setNewTripClicked={setNewTripClicked}
                            setIsFetchProcessing={setIsFetchProcessing}
                            setActiveTrip={setActiveTrip}
                            fetchTrips={fetchTrips}
                            configureLists={configureLists}
                            setConnectionErrorMessage={setConnectionErrorMessage}
                        />
                        <AllTripsDropdown
                            allTrips={allTrips}
                            activeTrip={activeTrip}
                            setActiveTrip={setActiveTrip}
                            resetTripAndListStates={resetTripAndListStates}
                            fetchLists={fetchLists}
                            connectionErrorMessage={connectionErrorMessage}
                        />
                        {
                            (activeTrip.tripId) ? // I removed the condition && !isFetchProcessing - if it stays in, everytime we save the lists we get this blinky, glitchy effect. I think it's uncessary - the only thing in active trip console that requires on the fetch request is the save attempt message, and it seems to work fine. Keep and eye on this though. There might have been an edge case error that I put the condition in to address originally. 

                                <ActiveTripConsole
                                    setNewTripClicked={setNewTripClicked}
                                    activeTrip={activeTrip}
                                    setActiveTrip={setActiveTrip}
                                    fetchTrips={fetchTrips}
                                    editTripDetails={editTripDetails}
                                    resetTripAndListStates={resetTripAndListStates}
                                    lists={lists}
                                    allListItems={allListItems}
                                    fetchLists={fetchLists}
                                    createNewList={createNewList}
                                    setConnectionErrorMessage={setConnectionErrorMessage}
                                />
                                : null
                        }
                        <p>{connectionErrorMessage}</p>
                    </div>

                    <GuestUserModal 
                        openGuestUserModal={openGuestUserModal}
                        setOpenGuestUserModal={setOpenGuestUserModal} />

                    <ConfirmCredentialsModal
                        openConfirmCredentialsModal={openConfirmCredentialsModal}
                        setOpenConfirmCredentialsModal={setOpenConfirmCredentialsModal} />

                    {
                        lists.length && allListItems.length && !isFetchProcessing ?
                            <Lists
                                tripId={activeTrip.tripId}
                                lists={lists}
                                setLists={setLists}
                                allListItems={allListItems}
                                setAllListItems={setAllListItems}
                                allDeletedItems={allDeletedItems}
                                setAllDeletedItems={setAllDeletedItems}
                                setConnectionErrorMessage={setConnectionErrorMessage} />
                            : null
                    }

                </main>

                <span ref={newListRef}></span>

                <Footer />
            </div>
    );
}