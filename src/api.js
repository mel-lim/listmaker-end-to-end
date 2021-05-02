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

export const fetchTripsApi = () => {
    return getApiCall(`/api/trips/alltrips`);
}

export const fetchListsApi = tripId => {
    return getApiCall(`/api/trips/${tripId}/lists/fetchlists`);
}

export const getAccountDetailsApi = () => {
    return getApiCall('/api/appusers/accountdetails');
}