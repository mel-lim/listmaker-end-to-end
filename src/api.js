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
    }
    catch (error) {
        console.error("Error in stack at api.js - possible server connection error", error);
    }
}

export const signUpNewUserApi = requestBodyContent => {
    return postApiCall('/api/appusers/signup', requestBodyContent);
}

export const checkUserCredentialsApi = requestBodyContent => {
    return postApiCall('/api/appusers/login', requestBodyContent);
}

export const fetchTripsApi = () => {
    return getApiCall(`/api/trips/alltrips`);
}

export const fetchListsApi = tripId => {
    return getApiCall(`/api/trips/${tripId}/lists/fetchlists`);
}

export const createTripApi = requestBodyContent => {
    return postApiCall('/api/trips/newtrip', requestBodyContent);
}

export const editTripDetailsApi = async (tripId, requestBodyContent) => {
    return putApiCall(`/api/trips/${tripId}/edittripdetails`, requestBodyContent);
}

export const saveListChangesApi = async (tripId, requestBodyContent) => {
    return postApiCall(`/api/trips/${tripId}/lists/savelists`, requestBodyContent);
}

export const createNewListApi = async (tripId) => {
    return postApiCall(`/api/trips/${tripId}/lists/createnew`, null);
}

export const editListTitleApi = async (tripId, listId, requestBodyContent) => {
    return putApiCall(`/api/trips/${tripId}/lists/${listId}/edit`, requestBodyContent);
}

export const deleteListApi = async (tripId, listId) => {
    return deleteApiCall(`/api/trips/${tripId}/lists/${listId}/delete`, null);
}

export const newListItemApi = async (tripId, listId, requestBodyContent) => {
    return postApiCall(`/api/trips/${tripId}/lists/${listId}/listitems/addnew`, requestBodyContent);
}

export const editListItemApi = async (tripId, listId, itemId, requestBodyContent) => {
    return putApiCall(`/api/trips/${tripId}/lists/${listId}/listitems/${itemId}/edit`, requestBodyContent);
}

export const deleteListItemApi = async (tripId, listId, itemId) => {
    return putApiCall(`/api/trips/${tripId}/lists/${listId}/listitems/${itemId}/delete`, null);
}

export const undoDeleteListItemApi = async (tripId, listId, itemId) => {
    return putApiCall(`/api/trips/${tripId}/lists/${listId}/listitems/${itemId}/undodelete`, null);
}

export const deleteTripApi = async tripId => {
    return deleteApiCall(`/api/trips/${tripId}/deletetrip`, null);
}

export const getAccountDetailsApi = () => {
    return getApiCall('/api/appusers/accountdetails');
}

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

export const sendMessageApi = async requestBodyContent => {
    return postApiCall('/api/contact', requestBodyContent);
}


