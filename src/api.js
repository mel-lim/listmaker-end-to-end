const getApiCall = async url => {
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

const postApiCall = async (url, requestBodyContent) => {
    const response = await fetch(url, {
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
    return { response, responseBodyText };
}

const putApiCall = async (url, requestBodyContent) => {
    const response = await fetch(url, {
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
    return { response, responseBodyText };
}

export const postNewUserApi = async requestBodyContent => {
    return postApiCall('/api/appusers/signup', requestBodyContent);
}

export const checkUserCredentialsApi = async requestBodyContent => {
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

export const saveTripDetailsApi = async (tripId, requestBodyContent) => {
    return putApiCall(`/api/trips/${tripId}/savetripdetails`, requestBodyContent);
}

export const saveListChangesApi = async (tripId, requestBodyContent) => {
    return postApiCall(`/api/trips/${tripId}/lists/savelists`, requestBodyContent);
}

export const saveEditedListItemApi = async (tripId, requestBodyContent) => {
    return putApiCall(`/api/trips/${tripId}/lists/saveeditedlistitem`, requestBodyContent);
}

export const saveNewListItemApi = async (tripId, requestBodyContent) => {
    return postApiCall(`/api/trips/${tripId}/lists/savenewlistitem`, requestBodyContent);
}

export const deleteListItemApi = async (tripId, requestBodyContent) => {
    return putApiCall(`/api/trips/${tripId}/lists/deletelistitem`, requestBodyContent);
}

export const deleteTripApi = async tripId => {
    const response = await fetch(`/api/trips/${tripId}/deletetrip`, {
        method: 'DELETE',
        mode: 'cors',
        cache: 'default',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer'
    });
    return response;
}

export const getAccountDetailsApi = () => {
    return getApiCall('/api/appusers/accountdetails');
}

export const logoutApi = async () => {
    const response = await fetch('/api/appusers/logout', {
        method: 'GET',
        mode: 'cors',
        cache: 'no-store', // See if this will make logout work when in production 
        // YES THIS WORKS!!!!!!!!!!! Note this solved an issue in both Firefox and Chrome where the cache was not letting my backend clear my cookies on logout for some reason. This was only in production (Heroku/Netlify) and not in dev (localhost)
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

export const sendMessageApi = async requestBodyContent => {
    return postApiCall('/api/contact', requestBodyContent);
}


