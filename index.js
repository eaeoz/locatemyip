#!/usr/bin/env node

async function getTimezone() {
    try {
        const response = await fetch('https://ipinfo.io/json');

        // Check if the response is okay (status code 200)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Extract the timezone information
        const timezone = data.timezone;

        // Format the timezone string
        const formattedTimezone = timezone.split('/').slice(1).join('/');

        console.log(formattedTimezone);
    } catch (error) {
        console.error('Error fetching timezone:', error);
    }
}

getTimezone();
