import axios from 'axios';
import React, { useEffect, useState } from 'react'

const Interval = () => {
    const [failedPings, setFailedPings] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [latitude, setLatitude] = useState(0);

    useEffect(() => {
        const pingInterval = setInterval(() => {
            console.log(failedPings);
            if(!isDead()) {
                console.log('Fetching Data...');
                fetchLocationData();
            } else {
                console.log('Halting fetching of ISS data');
                clearInterval(pingInterval);
            }
        }, 1000);

        return () => {
            clearInterval(pingInterval);
        }
    });

    const fetchLocationData = () => {
        axios({
            method: 'GET',
            url: 'https://api.wheretheiss.at/v1/satellites/25544'
        }).then((res) => {
            setLatitude(res.data.latitude);
            setLongitude(res.data.longitude);
        }).catch((error) => {
            console.log('Could not fetch ISS data', error);
            setFailedPings(prevCount => prevCount + 1);
        });
    }

    const isDead = () => {
        return failedPings >= 10;
    }

    return (
        <div>
            <h1>ISS Location</h1>
            <hr/>
            <h2>Latitude: {latitude}</h2>
            <h2>Longitude: {longitude}</h2>
        </div>
    )
}

export default Interval;