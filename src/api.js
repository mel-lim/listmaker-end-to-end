// Import config data
import configData from "./config.json";

const getApiCall = async url => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'default',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer'
        });
        const responseBodyText = await response.json();
        return { response, responseBodyText };
    }
    catch (error) {
        console.error("Error in stack at api.js - possible server connection error", error);
    }
}

const postApiCall = async (url, requestBodyContent) => {
    const req = {
        method: 'POST',
        mode: 'cors',
        cache: 'default',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer'
    };
    if (requestBodyContent) {
        req.body = JSON.stringify(requestBodyContent)
    }
    try {
        const response = await fetch(url, req);
        const responseBodyText = await response.json();
        return { response, responseBodyText };
    }
    catch (error) {
        console.error("Error in stack at api.js - possible server connection error", error);
    }
}

const putApiCall = async (url, requestBodyContent) => {
    const req = {
        method: 'PUT',
        mode: 'cors',
        cache: 'default',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer'
    };
    if (requestBodyContent) {
        req.body = JSON.stringify(requestBodyContent);
    }
    try {
        const response = await fetch(url, req);
        const responseBodyText = await response.json();
        return { response, responseBodyText };
    }
    catch (error) {
        console.error("Error in stack at api.js - possible server connection error", error);
    }
}

const deleteApiCall = async (url, requestBodyContent) => {
    const req = {
        method: 'DELETE',
        mode: 'cors',
        cache: 'default',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer'
    };
    if (requestBodyContent) {
        req.body = JSON.stringify(requestBodyContent);
    }
    try {
        const response = await fetch(url, req);
        return response;
        // NOTE: If the server is disconnected, this won't throw an error. The response status received is 500. It's only if we try to do response.json() that we will get an error
    }
    catch (error) {
        console.error("Error in stack at api.js - possible server connection error", error);
    }
}

// Exponential backoff delay function
export const delay = retryCount => new Promise(resolve => setTimeout(resolve, parseInt(configData.EXPONENTIAL_BACKOFF_BASE) * retryCount));

export const signUpNewUserApi = requestBodyContent => {
    return postApiCall('/api/appusers/signup', requestBodyContent);
}

export const checkUserCredentialsApi = requestBodyContent => {
    return postApiCall('/api/appusers/login', requestBodyContent);
}

export const tryAsGuestApi = () => {
    return postApiCall('/api/appusers/tryasguest', null);
}

// Called by fetchTrips in Dashboard.js
export const fetchTripsApi = () => {
    return getApiCall(`/api/trips/alltrips`);
}

// Called by createTrip in NewTripForm.js
export const createTripApi = requestBodyContent => {
    return postApiCall('/api/trips/newtrip', requestBodyContent);
}

// Called by editTripDetails in Dashboard.js
export const editTripDetailsApi = async (tripId, requestBodyContent) => {
    return putApiCall(`/api/trips/${tripId}/edittripdetails`, requestBodyContent);
}

// Called by deleteTrip in ConfirmDeleteTripModal.js
export const deleteTripApi = async tripId => {
    return deleteApiCall(`/api/trips/${tripId}/deletetrip`, null);
}

// Called by fetchLists in Dashboard.js
export const fetchListsApi = tripId => {
    return getApiCall(`/api/trips/${tripId}/lists/fetchlists`);
}

// Called by createNewList in Dashboard.js
export const createNewListApi = async (tripId) => {
    return postApiCall(`/api/trips/${tripId}/lists/createnew`, null);
}

// Called by editListTitle in List.js
export const editListTitleApi = async (tripId, listId, requestBodyContent) => {
    return putApiCall(`/api/trips/${tripId}/lists/${listId}/edit`, requestBodyContent);
}

// Called by deleteList in List.js
export const deleteListApi = async (tripId, listId) => {
    return deleteApiCall(`/api/trips/${tripId}/lists/${listId}/delete`, null);
}

// Called by addListItem in List.js
export const newListItemApi = async (tripId, listId, requestBodyContent) => {
    return postApiCall(`/api/trips/${tripId}/lists/${listId}/listitems/addnew`, requestBodyContent);
}

// Called by editListItem in ListItem.js
export const editListItemApi = async (tripId, listId, itemId, requestBodyContent) => {
    return putApiCall(`/api/trips/${tripId}/lists/${listId}/listitems/${itemId}/edit`, requestBodyContent);
}

// Called by deleteListItem in List.js
export const deleteListItemApi = async (tripId, listId, itemId) => {
    return putApiCall(`/api/trips/${tripId}/lists/${listId}/listitems/${itemId}/delete`, null);
}

// Called by undoDelete in List.js
export const undoDeleteListItemApi = async (tripId, listId, itemId) => {
    return putApiCall(`/api/trips/${tripId}/lists/${listId}/listitems/${itemId}/undodelete`, null);
}

// Called by getAccountDetails in MyAccount.js
export const getAccountDetailsApi = () => {
    return getApiCall('/api/appusers/accountdetails');
}

// Called by logout in Logout.js
export const logoutApi = async () => {
    try {
        const response = await fetch('/api/appusers/logout', {
            method: 'GET',
            mode: 'cors',
            cache: 'no-store', // Note this solved an issue in both Firefox and Chrome where the cache was not letting my backend clear my cookies on logout for some reason. This was only in production (Heroku/Netlify) and not in dev (localhost)
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer'
        });
        const responseBodyText = await response.json();
        return { response, responseBodyText };
    }
    catch (error) {
        console.error("Error in stack at api.js - possible server connection error", error);
    }
}

// Called by handleSubmit in Contact.js
export const sendMessageApi = async requestBodyContent => {
    return postApiCall('/api/contact', requestBodyContent);
}


